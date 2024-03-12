const Author = require('../../models/author');
const Book=require('../../models/book')
const Genre = require('../../models/genre');
const { getAsync, setAsync,delAsync } = require('../../redis/redisclient');

const getAuthor = async (authorId) => {
  try {
    //Attempting to fetch cached Author
    let catchedAuthor=await getAsync(`authorid${authorId}`)
    if(catchedAuthor){
      catchedAuthor=JSON.parse(catchedAuthor)
      return {
        ...catchedAuthor,
        password:null,
        books:getBooksByIds.bind(this,catchedAuthor.books)
      }
    }
    else{

      // retrieving  author from the db
      const author = await Author.findById(authorId)
      if(!author){
        throw new Error('author not found')
      }
      // catch the author fetched from db
      await  setAsync(`authorid${authorId}`,JSON.stringify(author),'Ex',1000)
      // returning the author
      return {
        ...author._doc,
        password:null,
        _id: author.id,
        books:getBooksByIds.bind(this,author._doc.books)
      }

    }
   
  } catch (err) {
    throw err
  }
}

const getBooksByIds = async (bookIds) => {
  try {
    // Attempting to fetch cached cached books
    let cachedBooks = await getAsync(`bookids${bookIds}`);
    if (cachedBooks) {
      console.log('fetch from catche')
      cachedBooks = JSON.parse(cachedBooks);
      // returning the  books from the cache
      return cachedBooks.map((book) => ({
        ...book,
        publicationDate: new Date(book.publicationDate).toISOString(),
        author: getAuthor.bind(this, book.author),
        genres: getGenres.bind(this, book.genres),
      }))
    } 
    else {

    // fetching the books from db
      const booksFromDB = await Book.find({ _id: { $in: bookIds } })
      if (!booksFromDB || booksFromDB.length === 0) {
        return [];
      }
      console.log('fetch from db')
      // cache the books fetched from db
      await setAsync(`bookids${bookIds}`, JSON.stringify(booksFromDB), 'EX', 100)
      // returning the books
      return booksFromDB.map((book) => ({
        ...book._doc,
        _id: book.id,
        publicationDate: new Date(book._doc.publicationDate).toLocaleString(),
        author: getAuthor.bind(this, book._doc.author),
        genres: getGenres.bind(this, book._doc.genres),
      }))
    }
  } catch (err) {
    throw err
  }
}


const getGenres = async (genreIds) => {
  try {
    // Convert genreIds array to a string key for caching
    const cacheKey = `genreIds:${genreIds.sort().join(',')}`

    // Attempt to fetch cached genres
    let cachedGenres = await getAsync(cacheKey)
    if (cachedGenres) {
      cachedGenres = JSON.parse(cachedGenres)
      return cachedGenres.map(genre => ({
        ...genre
      })
      )
    } 
    else {
      const genresFromDB = await Genre.find({ _id: { $in: genreIds } })
      if (!genresFromDB || genresFromDB.length === 0) {
        return []
      }

      // Cache the genres fetched from the database
      await setAsync(cacheKey, JSON.stringify(genresFromDB), 'EX', 100)

      return genresFromDB.map(genre => ({
        ...genre._doc,
        _id: genre.id,
      })
      )
    }
  } catch (err) {
    throw err
  }
}


const getAllAuthorEmails = async () => {
  try {
    const allAuthors = await Author.find()

    return allAuthors.map((author) => author.email)
  } catch (err) {
    throw err
  }
}

module.exports = {
  getAuthor,
  getGenres,
  getAllAuthorEmails,
  getBooksByIds,
}
