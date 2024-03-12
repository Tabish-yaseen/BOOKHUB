const Book = require('../../models/book');
const BookDownload = require('../../models/bookdownload');
const s3Services = require('../../services/s3service');
const{getAuthor}=require('./helpers')

module.exports = {
  createBookUrl: async ({ bookId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
      // fetching the book
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const bookContent = JSON.stringify(book)

    const fileName = `book_${bookId}.txt`
      // uploading to the s3 bucket of Aws
    const s3UploadResponse = await s3Services.uploadToS3(bookContent, fileName);
      // saving into db
    const bookDownload = new BookDownload({
      book: bookId,
      author: req.authorId,
      downloadUrl: s3UploadResponse,
    })

    await bookDownload.save();
      // returning the newly dowloading book url
    return {
      ...bookDownload._doc,
      author:getAuthor.bind(this, bookDownload._doc.author),
      _id: bookDownload.id,
      downloadedAt: new Date(bookDownload.downloadedAt).toISOString(),
    };
  },
};
