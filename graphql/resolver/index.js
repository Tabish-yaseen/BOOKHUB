const authorResolver=require('./author')
const genreResolver=require('./genre')


const rootResolver={
    ...authorResolver,
    ...genreResolver
   
}

module.exports=rootResolver