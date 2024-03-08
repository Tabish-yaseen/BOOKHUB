const Author = require('../../models/author');
const bcrypt = require('bcryptjs');

module.exports = {
    createAuthor: async (args) => {
      try {
        const existingAuthor = await Author.findOne({ email: args.authorInput.email });
        if (existingAuthor) {
          throw new Error('User exists already.');
        }
        const hashedPassword = await bcrypt.hash(args.authorInput.password, 12);
        const author = new Author({
          username:args.authorInput.username,
          email: args.authorInput.email,
          password: hashedPassword,
        });
        const result = await author.save();
        // return result
        return { ...result._doc,password:null, _id: result.id };
      } catch (err) {
        throw err;
      }
    },
    authors:async()=>{
        try{
      const authors= await Author.find()
      // console.log(authors);
       return authors.map((author)=>{
        return{
            ...author._doc,
            password:null,
            _id: author.id,
        }
       })
        }catch(err){
            throw err
        }
       
    }
}