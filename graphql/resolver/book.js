const Book = require('../../models/book');
const { getAuthor, getGenres } = require('./helpers');

module.exports = {
  createBook: async (args) => {
    try {
      const book = new Book({
        title: args.bookInput.title,
        description: args.bookInput.description,
        publicationDate: args.bookInput.publicationDate,
        author: args.bookInput.authorId,
        genres: args.bookInput.genreIds,
      });

      const result = await book.save();

      return {
        ...result._doc,
        _id: result.id,
        author: getAuthor.bind(this, result._doc.author),
        genres: getGenres.bind(this, result._doc.genres), 
      };
    } catch (err) {
      throw err;
    }
  },
};
