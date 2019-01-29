const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const URL_MLAB = 'mongodb://matt:test123@ds145868.mlab.com:45868/gql-ninja-tut';

const app = express();

//connext to mlab database
mongoose.connect(URL_MLAB, {useNewUrlParser:true} );
mongoose.connection.once('open',
()=>{
  console.log('Connected to database')},
  (err)=>{
    console.log("err", err);
  });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(4000, () => {
  console.log('Now listening for requests on Port: 4000');
})
