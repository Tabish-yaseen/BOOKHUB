const Genre=require('../../models/genre')
const{getAuthor}=require('./helpers')
const { getAsync, setAsync} = require('../../redis/redisclient')


module.exports={
    createGenre: async ({ genreInput },req) => {
        if(!req.isAuth){
            throw new Error('unauthenticated')
          }
        try {
            const genre = new Genre({
                name: genreInput.name,
                description: genreInput.description,
                author:req.authorId
            });
            const result = await genre.save()

            return {
                ...result._doc,
                author:getAuthor.bind(this,result._doc.author),
                _id: result.id,
            };
        } catch (error) {
            throw error
        }
    },


    updateGenre: async ({ id, genreInput }, req) => {
        if (!req.isAuth) {
            throw new Error('unauthenticated')
        }
        try {
            const existingGenre = await Genre.findById(id)
            if (!existingGenre) {
                throw new Error('Genre not found')
            }

            if (existingGenre.author.toString() !== req.authorId) {
                throw new Error('You are not authorized to update this Genre')
            }

            const updatedGenre = await Genre.findByIdAndUpdate(
                id,
                { $set: genreInput },
                { new: true }
            );

            if (!updatedGenre) {
                throw new Error('Genre not found')
            }

            return {
                ...updatedGenre._doc,
                author: getAuthor.bind(this, updatedGenre._doc.author),
                _id: updatedGenre.id,
            };
        } catch (err) {
            throw err
        }
    },

    genres: async (args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated')
        }
        try {
          // Checking if genres data exists in the cache
          const cachedGenres = await getAsync('all_genres')
          if (cachedGenres) {
            return JSON.parse(cachedGenres).map(genre => ({
              ...genre,
              author: getAuthor.bind(this, genre.author),
        
            }));
          } else {
            const genres = await Genre.find()
            console.log('Fetching from the database')

            await setAsync('all_genres', JSON.stringify(genres), 'EX', 10)
    
            return genres.map(genre => ({
              ...genre._doc,
              author: getAuthor.bind(this, genre._doc.author),
              _id: genre.id,
            }));
          }
        } catch (err) {
          throw err
        }
      },
    
}


