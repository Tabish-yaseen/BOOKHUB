const Book = require('../../models/book');
const Author=require('../../models/author')
const { getAsync, setAsync,delAsync } = require('../../redis/redisclient')
const { publishNewBookNotification } = require('../../rabbitmq/publisher')
const { getAuthor, getGenres, getAllAuthorEmails } = require('./helpers')

module.exports = {
  books: async () => {
    // Attempting to fetch  cached books
  try {
    let booksCache = await getAsync('all_books');
  if (booksCache) {
    console.log("fetching from cache");

    booksCache = JSON.parse(booksCache);
       // returning from cache
    return booksCache.map(book => ({
      ...book,
      author: getAuthor.bind(this, book.author),
      genres: getGenres.bind(this, book.genres),
    }));
  
    } 
    else {
      // fetching  books from the db
      const booksFromDB = await Book.find();

      if (!booksFromDB || booksFromDB.length === 0) {
        return [];
      }
          // cache the books fetched from db
      await setAsync('all_books', JSON.stringify(booksFromDB), 'EX', 10);
       // returning the result
      return booksFromDB.map(book => ({
        ...book._doc,
        _id: book.id,
        publicationDate: new Date(book._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, book._doc.author),
        genres: getGenres.bind(this, book._doc.genres),
      }));
    }
  } catch (err) {
    console.error('Error fetching books:', err);
    throw err;
  }
},
// creating the book
  createBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const book = new Book({
        title: args.bookInput.title,
        description: args.bookInput.description,
        publicationDate: new Date(args.bookInput.publicationDate),
        author: req.authorId,
        genres: args.bookInput.genreIds,
      });
          // saving the book details in db
      const result = await book.save()

      if (!result) {
        throw new Error('Book creation failed')
      }


// adding book to the creator(author)
      const author = await Author.findById(req.authorId);
       if (author) {
       author.books.push(result._id)
       await author.save()
    }
          // retriving all the mails of author's  
      const authorEmails=await getAllAuthorEmails() 
      if(authorEmails){
        const bookData = {
          bookTitle: result.title,
          authorEmails,
        };
        // publishing the mails and book title into the rabbit mq
        publishNewBookNotification(bookData)

      }

    // returning the result
      return {
        ...result._doc,
        _id: result.id,
        publicationDate: new Date(result._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, result._doc.author),
        genres: getGenres.bind(this, result._doc.genres),
      };
    } catch (err) {
      throw err
    }
  },

  // fetching the books of author
  getAuthorBooks: async ({ authorId }) => {
    try {
  // Attempting to fetch cached author's books
      const cachedAuthorBooks = await getAsync(`${authorId}`);
      if (cachedAuthorBooks) {
        return JSON.parse(cachedAuthorBooks).map((book)=>{
          return{
            ...book,
          author:getAuthor.bind(this,book.author),
          genres:getGenres.bind(this,book.genres)

          }

        });
      } else {

        // fetching the author
        const author = await Author.findById(authorId);
        if (!author) {
          throw new Error('Author not found');
        }
         
        // fetching the books of author
        const books = await Book.find({author:authorId});
         // catch the author's book fetched from db
        await setAsync(`${authorId}`, JSON.stringify(books), 'EX', 300);

        // returning the  author's books
        return books.map((book)=>{
          return {
          ...book._doc,
          _id:book.id,
          author:getAuthor.bind(this,book._doc.author),
          genres:getGenres.bind(this,book._doc.genres)

          }
          
        })
      }
    } catch (err) {
      throw err
    }
  },

  updateBook: async ({ id, bookInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const book = await Book.findById(id)

      if (!book) {
        throw new Error('Book not found')
      }
    
       // checking if the book is of the author who created the book
      if (book.author.toString() !== req.authorId) {
        throw new Error('You are not authorized to update this book')
      }
      // updating the book
      book.title = bookInput.title
      book.description = bookInput.description
      book.publicationDate = new Date(bookInput.publicationDate)
      book.author = req.authorId
      book.genres = bookInput.genreIds

      const updatedBook = await book.save()
// returning the updated book
      return {
        ...updatedBook._doc,
        _id: updatedBook.id,
        publicationDate: new Date(updatedBook._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, updatedBook._doc.author),
        genres: getGenres.bind(this, updatedBook._doc.genres),
      };
    } catch (err) {
      throw err
    }
  },

  deleteBook: async ({ id }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const book = await Book.findById(id)

      if (!book) {
        throw new Error('Book not found')
      }
      // checking if the author is same who created the book or not

      if (book.author.toString() !==req.authorId) {
        throw new Error('You are not authorized to delete this book')
      }
         // fetching the book and then deleting the book 
      const deletedBook = await Book.findByIdAndDelete(id)

      if (!deletedBook) {
        throw new Error('Book not found')
      }
      // deleting the deleted book  from the cache
      await delAsync(`${id}`)
      
      // returning the deleted book
      return {
        ...deletedBook._doc,
        _id: deletedBook.id,
        publicationDate: new Date(deletedBook._doc.publicationDate).toISOString(),
        author: getAuthor.bind(this, deletedBook._doc.author),
        genres: getGenres.bind(this, deletedBook._doc.genres),
      };
    } catch (err) {
      throw err
    }
  },
  
}
