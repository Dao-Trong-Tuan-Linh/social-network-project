import {ApolloServer} from "apollo-server"
import mongoose from "mongoose"
import dotenv from 'dotenv';
import { typeDefs } from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";
import {PubSub} from "graphql-subscriptions"

dotenv.config()
const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) => ({req,pubsub})
})

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected")
    return server.listen({port:4000})
}).then((res) => {
    console.log(`Server is running at ${res.url}`)
})

