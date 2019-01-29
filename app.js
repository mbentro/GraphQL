const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const URL_MLAB   = 'mongodb://Matt:Matt123@ds145868.mlab.com:45868/gql-ninja-tut';

const app = express();

//connext to mlab database
mongoose.connect(URL_MLAB, {useNewUrlParser:true} )
mongoose.connection.open('open', ()=>{
  console.log('connected to database');
})

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(4000, () => {
  console.log('Now listening for requests on Port: 4000');
})
