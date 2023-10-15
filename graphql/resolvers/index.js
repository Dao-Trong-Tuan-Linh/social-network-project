import postsResolvers from "./post.js"
import userResolvers from "./user.js";
import commentsResolvers from "./comments.js"

const resolvers = {
    Post:{
        likeCount(parent) {
            console.log(parent);
            return parent.likes.length
        },
        commentCount:(parent) => parent.comments.length
    },
    Query:{
        ...postsResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription:{
        ...postsResolvers.Subscription
    }
}

export default resolvers;