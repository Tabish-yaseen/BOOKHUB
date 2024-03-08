const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Genre {
    _id: ID!
    name: String!
    description: String!
  }

  type Book {
    _id: ID!
    title: String!
    author: User!
    genres: [Genre!]!
  }

  input UserInput {
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
    authorId: ID!
    genreIds: [ID!]!
  }

  type RootQuery {
    users: [User!]!
    genres: [Genre!]!
    books: [Book!]!
    
  }

  type RootMutation {
    createUser(userInput: UserInput): User

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
