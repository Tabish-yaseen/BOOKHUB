const Author = require('../../models/author');
const Genre = require('../../models/genre');

const getAuthor = async (authorId) => {
  try {
    const author = await Author.findById(authorId);
    return {
      ...author._doc,
      _id: author.id,
    };
  } catch (err) {
    throw err;
  }
};

const getGenres = async (genreIds) => {
  try {
    const genres = await Genre.find({ _id: { $in: genreIds } });
    return genres.map((genre) => ({
      ...genre._doc,
      _id: genre.id,
    }));
  } catch (err) {
    throw err;
  }
};

const getAllAuthorEmails = async () => {
  try {
    const allAuthors = await Author.find();
    return allAuthors.map((author) => author.email);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAuthor,
  getGenres,
  getAllAuthorEmails,
};
