const Book = require("../../models/book");
const { getAuthor, getGenres } = require("./helpers");

module.exports = {
  books: async (args,req) => {
    if(!req.isAuth){
        throw new Error('unauthenticated')
      }
    try {
      const books = await Book.find();

      if (!books || books.length === 0) {
        return [];
      }
      return books.map((book) => {
        return {
          ...book._doc,
          _id: book.id,
          publicationDate: new Date(book._doc.publicationDate).toISOString(),
          author: getAuthor.bind(this, book.author),
          genres: getGenres.bind(this, book.genres),
        };
      });
    } catch (err) {
      throw err;
    }
  },

  createBook: async (args,req) => {
    if(!req.isAuth){
        throw new Error('unauthenticated')
      }
    console.log(req.authorId,"heee");
    try {
      const book = new Book({
        title: args.bookInput.title,
        description: args.bookInput.description,
        publicationDate: new Date(args.bookInput.publicationDate),
        author: req.authorId,
        genres: args.bookInput.genreIds,
      });

      const result = await book.save();

      if (!result) {
        throw new Error("Book creation failed.");
      }

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

  updateBook: async ({ id, bookInput },req) => {
    if(!req.isAuth){
        throw new Error('unauthenticated')
      }
    try {
      const book = await Book.findById(id);

      if (!book) {
        throw new Error("Book not found.");
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
        publicationDate: new Date(
          updatedBook._doc.publicationDate
        ).toISOString(),
        author: getAuthor.bind(this, updatedBook._doc.author),
        genres: getGenres.bind(this, updatedBook._doc.genres),
      };
    } catch (err) {
      throw err;
    }
  },

  deleteBook: async ({ id },req) => {
    if(!req.isAuth){
        throw new Error('unauthenticated')
      }
    try {
      const deletedBook = await Book.findByIdAndDelete(id);

      if (!deletedBook) {
        throw new Error("Book not found");
      }

      return {
        ...deletedBook._doc,
        _id: deletedBook.id,
      };
    } catch (err) {
      throw err;
    }
  },
};
