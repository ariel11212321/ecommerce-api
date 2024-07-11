const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const UserType = require('./userType');
const ProductType = require('./productType');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    products: { type: new GraphQLList(ProductType) },
    total: { type: GraphQLString },
    status: { type: GraphQLString }
  })
});

module.exports = OrderType;
