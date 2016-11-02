var express = require('express');
var bodyParser = require('body-parser');
var { apolloExpress, graphiqlExpress } = require('apollo-server');
var { makeExecutableSchema } = require('graphql-tools');

var typeDefs = [`
type Query {
  user(id: ID!): User,
  address(id: ID!): Address
}

type User {
  id: Int,
  firstName: String,
  lastName: String,
  address: Address
}

type Address {
  id: Int,
  street: String,
  user: User
}

schema {
  query: Query
}`];

const users = {
  1: { id: 1, firstName: 'Jeff', lastName: 'Meyers' },
  2: { id: 2, firstName: 'Jasmine', lastName: 'May' }
};

const addresses = [
  { id: 1, user_id: 1, street: 'Lincoln Ave' },
  { id: 2, user_id: 2, street: 'Huron St' }
];

var resolvers = {
  Query: {
    user(obj, args, context) {
      return users[args.id];
    },
    address(obj, args, context) {
      return addresses.find((address) => address.id == args.id);
    }
  },
  User: {
    id(user) {
      return user.id;
    },
    firstName(user) {
      return user.firstName;
    },
    lastName(user) {
      return user.lastName;
    },
    address(user) {
      return addresses.find((address) => address.user_id === user.id);
    }
  },
  Address: {
    user(address) {
      return users[address.user_id];
    }
  }
};

var schema = makeExecutableSchema({typeDefs, resolvers});
var app = express();
app.use('/graphql', bodyParser.json(), apolloExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
