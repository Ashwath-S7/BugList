const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const BugType = require("./UserType");
const pool = require("./Database");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    bugs: {
      type: GraphQLList(BugType),
      resolve: async () => {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM bugs");
        connection.release();
        return rows;
      },
    },
  },
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBug: {
      type: BugType,
      args: {
        name: { type: GraphQLString },
        status: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const connection = await pool.getConnection();
        const [result] = await connection.query(
          "INSERT INTO bugs (name, status) VALUES (?, ?)",
          [args.name, args.status]
        );
        connection.release();
        return { id: result.insertId, name: args.name, status: args.status };
      },
    },
    updateBugStatus: {
      type: BugType,
      args: {
        id: { type: GraphQLInt },
        status: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const connection = await pool.getConnection();
        await connection.query("UPDATE bugs SET status = ? WHERE id = ?", [
          args.status,
          args.id,
        ]);
        connection.release();
        return { id: args.id, status: args.status };
      },
    },
    deleteBug: {
      type: GraphQLInt,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: async (_, args) => {
        const connection = await pool.getConnection();
        await connection.query("DELETE FROM bugs WHERE id = ?", [args.id]);
        connection.release();
        return args.id;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
