const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Schemas");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
