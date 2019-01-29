const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');   //How we interact with the Book/Author collection
const Author = require('../models/author');

const { GraphQLObjectType,
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull, //Tell frontend the NEED to sentd this data
      } = graphql;


//dummy data
// var books = [
//   {name:'Name of the Wind', genre: 'Fantasy', id:'1', authorId: '1'},
//   {name:'The Final Empire', genre:'Fantasy', id:'2', authorId: '2'},
//   {name:'The Hero of Age', genre:'Fantasy', id:'4', authorId: '2'},
//   {name:'The Long Earth', genre:'Sci-Fi', id:'3', authorId: '3'},
//   {name:'The Colour of Magic', genre:'Fantasy', id:'5', authorId: '3'},
//   {name:'The Light Fantastic', genre:'Fantasy', id:'6', authorId: '3'},
// ];
//
// var authors = [
//   {name: 'Patrick Rothfuss',age:44, id:'1'},
//   {name: 'Brendon Sanderson', age:42, id: '2' },
//   {name: 'Terry Pratchett', age:66, id:'3'},
// ]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({ //Wrap the fields in a function
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: { type: AuthorType,
                resolve(parent, args){
                  // return _.find(authors, { id:parent.authorId});
                  return Author.findById(parent.authorId);
                }
              }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({  //Wrap the fields in a function
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    id: {type: GraphQLID},
    books: { type: new GraphQLList(BookType), //GraphQL List of BookTypes
      resolve(parent, args){
        //Filter through the books array on authorId = parent.id, all else get filtered out
        // return _.filter(books, {authorId: parent.id})
        return Book.find({authorId: parent.id});// find book based off authorId = parentId that was passed
      }}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        //code to get data from DB/Other source
        // return _.find(books, { id: args.id });
                console.log(args.id);
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type:GraphQLID }},
      resolve(parent, args){
        // return _.find(authors, {id: args.id});
        return Author.findById(args.id);
      }
    },
    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return books
        return Book.find({}); //.find with no object, returns ALL
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        // return authors
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields:{
    addAuthor:{
      type: AuthorType,
      args:{
        //new GraphQLNonNull() means they cannot pass a null value for this argument
        name: { type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve(parent, args){
        let author = new Author({ //local variable of new Author we imported above
          name: args.name,
          age: args.age,
        });
        return author.save();  //mongodb function
      }
    },
    addBook:{
      type: BookType,
      args:{
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
       return book.save();
     }
     }
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
