const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLString },
    stock: { type: GraphQLString }
  })
});

module.exports = ProductType;
