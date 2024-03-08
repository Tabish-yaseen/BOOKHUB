const authorResolver=require('./author')
const genreResolver=require('./genre')
const bookResolver=require('./book')


const rootResolver={
    ...authorResolver,
    ...genreResolver,
    ...bookResolver
   
}

module.exports=rootResolver