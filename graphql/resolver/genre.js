const Genre=require('../../models/genre')
const{getAuthor}=require('./helpers')
const { getAsync, setAsync} = require('../../redis/redisclient')


module.exports={
  // creating the genre
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
            // returning the created genre
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
          // checking if the existing genre is in the db
            const existingGenre = await Genre.findById(id)
            if (!existingGenre) {
                throw new Error('Genre not found')
            }
              // checking if the author is same who created the genre or not
            if (existingGenre.author.toString() !==req.authorId){ 
                throw new Error('You are not authorized to update this Genre')
            }
              // updating the genre
            const updatedGenre = await Genre.findByIdAndUpdate(
                id,
                { $set: genreInput },
                { new: true }
            );

            if (!updatedGenre) {
                throw new Error('Genre not found')
            }

            // returning the updated book

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
          // Attempting to fetch cached genres
          const cachedGenres = await getAsync('all_genres')
          if (cachedGenres) {
            return JSON.parse(cachedGenres).map(genre => ({
              ...genre,
              author: getAuthor.bind(this, genre.author),
        
            }))
          }
           else {

            // fetching from the db
            const genres = await Genre.find()
            
            // catch the genres fetched from the db
            await setAsync('all_genres', JSON.stringify(genres), 'EX', 10)

                // returning the genres
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


