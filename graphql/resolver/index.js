const authorResolver=require('./author')
const genreResolver=require('./genre')
const bookResolver=require('./book')
const downloadResolver=require('./download')


const rootResolver={
    ...authorResolver,
    ...genreResolver,
    ...bookResolver,
    ...downloadResolver
   
}

module.exports=rootResolver