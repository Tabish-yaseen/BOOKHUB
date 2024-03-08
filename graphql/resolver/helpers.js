
const Author = require('../../models/author');
const Genre = require('../../models/genre');

const getAuthor = async (authorId) => {
  console.log((authorId));
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
  console.log(genreIds);
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

exports.getAuthor=getAuthor
exports.getGenres=getGenres
