const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

const BugType = new GraphQLObjectType({
  name: "Bug",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

module.exports = BugType;
