const Author = require('../../models/author');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

    login: async ({ email, password }) => {
      try {
        const author = await Author.findOne({ email: email });
        if (!author) {
          throw new Error('Author does not exist');
        }
    
        const isPassword = await bcrypt.compare(password, author.password);
    
        if (isPassword) {
          const token = jwt.sign(
            { authorId: author.id, email: author.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
    
          return { authorId: author.id, token: token, tokenExpiration: 1 };
        } else {
          throw new Error('Password is incorrect');
        }
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