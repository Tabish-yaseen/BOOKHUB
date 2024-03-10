const Book = require('../../models/book');
const Author=require('../../models/author')
const { publishNewBookNotification } = require('../../rabbitmq/publisher');
const { getAuthor, getGenres, getAllAuthorEmails } = require('./helpers');

module.exports = {
  books: async () => {
    try {
      const books = await Book.find();

      if (!books || books.length === 0) {
        return [];
      }

      return books.map((book) => ({
        ...book._doc,
        _id: book.id,
        publicationDate: new Date(book._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, book.author),
        genres: getGenres.bind(this, book.genres),
      }));
    } catch (err) {
      throw err;
    }
  },

  createBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const book = new Book({
        title: args.bookInput.title,
        description: args.bookInput.description,
        publicationDate: new Date(args.bookInput.publicationDate),
        author: req.authorId, //"65eb7da8d1d90288423e76a4",
        genres: args.bookInput.genreIds,
      });

      const result = await book.save();

      if (!result) {
        throw new Error('Book creation failed.');
      }
      
      
      const authorEmails=await getAllAuthorEmails()

      const bookData = {
        bookTitle: result.title,
        authorEmails,
      };
      publishNewBookNotification(bookData);


      return {
        ...result._doc,
        _id: result.id,
        publicationDate: new Date(result._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, result._doc.author),
        genres: getGenres.bind(this, result._doc.genres),
      };
    } catch (err) {
      throw err;
    }
  },

  updateBook: async ({ id, bookInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const book = await Book.findById(id);

      if (!book) {
        throw new Error('Book not found.');
      }
      // console.log("id",book.author.toString)

      if (book.author.toString() !== req.authorId) {
        throw new Error('You are not authorized to update this book.');
      }

      
      book.title = bookInput.title;
      book.description = bookInput.description;
      book.publicationDate = new Date(bookInput.publicationDate);
      book.author = req.authorId; 
      book.genres = bookInput.genreIds;

      const updatedBook = await book.save();

      return {
        ...updatedBook._doc,
        _id: updatedBook.id,
        publicationDate: new Date(updatedBook._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, updatedBook._doc.author),
        genres: getGenres.bind(this, updatedBook._doc.genres),
      };
    } catch (err) {
      throw err;
    }
  },

  deleteBook: async ({ id }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const book = await Book.findById(id);

      if (!book) {
        throw new Error('Book not found');
      }

      if (book.author.toString() !== req.authorId) {
        throw new Error('You are not authorized to delete this book.');
      }

      const deletedBook = await Book.findByIdAndDelete(id);

      if (!deletedBook) {
        throw new Error('Book not found');
      }

      return {
        ...deletedBook._doc,
        _id: deletedBook.id,
        publicationDate: new Date(deletedBook._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, deletedBook._doc.author),
        genres: getGenres.bind(this, deletedBook._doc.genres),
      };
    } catch (err) {
      throw err;
    }
  },
  
};
