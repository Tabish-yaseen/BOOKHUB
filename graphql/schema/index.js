const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Author {
    _id: ID!
    username: String!
    email: String!
    password: String
  }

  type Genre {
    _id: ID!
    name: String!
    description: String!
  }

  type Book {
    _id: ID!
    title: String!
    description: String!
    publicationDate: String!
    author: Author!
    genres: [Genre!]!
  }

  input AuthorInput {
    username: String!
    email: String!
    password: String!
  }


  input GenreInput {
    name: String!
    description: String!
  }

  input BookInput {
    title: String!
    description: String!
    publicationDate: String!
    authorId: ID!
    genreIds: [ID!]!
  }

  type AuthData{
    authorId:ID!
    token:String!
    tokenExpiration:Int!
}

  type RootQuery {
    authors: [Author!]!
    genres: [Genre!]!
    books: [Book!]!
    
  }

  type RootMutation {
    createAuthor(authorInput: AuthorInput): Author
    login(email:String!,password:String!):AuthData!

    createGenre(genreInput: GenreInput): Genre
    updateGenre(id: ID!, genreInput: GenreInput): Genre

    createBook(bookInput: BookInput): Book
    updateBook(id: ID!, bookInput: BookInput): Book
    deleteBook(id: ID!): Book
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
