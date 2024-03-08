const Genre=require('../../models/genre')


module.exports={
    createGenre: async ({ genreInput }) => {
        try {
            const genre = new Genre({
                name: genreInput.name,
                description: genreInput.description,
            });
            const result = await genre.save()

            return {
                ...result._doc,
                _id: result.id,
            };
        } catch (error) {
            throw error;
        }
    },
    updateGenre: async ({ id, genreInput }) => {
        try {
            const updatedGenre = await Genre.findByIdAndUpdate(
                id,
                { $set: genreInput },
                { new: true } 
            )
            // console.log(updatedGenre)

            if (!updatedGenre) {
                throw new Error('Genre not found');
            }

            return {
                ...updatedGenre._doc,
                _id: updatedGenre.id,
            }
        } catch (err) {
            throw err
        }
    },
    genres: async () => {
        try {
            const genres = await Genre.find();
            if (!genres.length) {
                throw new Error('No genres found');
            }
            return genres.map((genre) => ({
                ...genre._doc,
                _id: genre.id
            }));
        } catch (err) {
            throw err;
        }
    }
    
}


