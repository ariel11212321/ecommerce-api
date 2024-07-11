const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');
const UserType = require('./types/userType');
const ProductType = require('./types/productType');
const OrderType = require('./types/orderType');
const userService = require('../services/userService');
const productService = require('../services/productService');
const orderService = require('../services/orderService');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await userService.getUserById(args.id);
      }
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await productService.getProductById(args.id);
      }
    },
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await orderService.getOrderById(args.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        return await userService.getAllUsers();
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      async resolve(parent, args) {
        return await productService.getAllProducts();
      }
    },
    orders: {
      type: new GraphQLList(OrderType),
      async resolve(parent, args) {
        return await orderService.getAllOrders();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = {
          name: args.name,
          email: args.email,
          password: args.password
        };
        return await userService.registerUser(user);
      }
    },
    addProduct: {
      type: ProductType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLString) },
        stock: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const product = {
          name: args.name,
          description: args.description,
          price: args.price,
          stock: args.stock
        };
        return await productService.createProduct(product);
      }
    },
    addOrder: {
      type: OrderType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        products: { type: new GraphQLNonNull(GraphQLList(GraphQLID)) },
        total: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const order = {
          user: args.userId,
          products: args.products.map(productId => ({ product: productId, quantity: 1 })), // Example quantity
          total: args.total
        };
        return await orderService.createOrder(order);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
