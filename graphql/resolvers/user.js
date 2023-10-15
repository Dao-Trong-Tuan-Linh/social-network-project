import User from "../../model/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {UserInputError} from "apollo-server"
import {validateLoginInput,validateRegisterInput} from "../../util/validators.js";

function generateToken(user) {
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    },process.env.SECRET_KEY,{expiresIn:'7d'})
}
const userResolvers = {
    Mutation:{
        async login(_,args){
            const {username,password} = args.loginInput
            const {errors,valid} = validateLoginInput(username,password)
            const user = await User.findOne({username})
            if(!valid) {
                throw new UserInputError('Errors',{errors})
            }
            if(!user) {
                errors.general = "User not found"
                throw new UserInputError('Wrong credentials',{errors})
            }
            const match = await bcrypt.compare(password,user.password)
            if(!match) {
                errors.general = "User not found"
                throw new UserInputError('Wrong credentials',{errors})
            }
            const token = generateToken(user)
            return{
                ...user._doc,
                id:user._id,
                token
            }
        },
        async register(_,args){
            let {username,password,confirmPassword,email} = args.registerInput
            //Validate user data
            const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword)
            if(!valid) {
                throw new UserInputError('Errors',{errors})
            }
            //Make sure user doesn't already exist
            const user = await User.findOne({username})
            if(user) {
                throw new UserInputError("Username is taken",{
                    errors:{
                        username:"This username is taken"
                    }
                })
            }
            //hash password and create an auth token
            const salt = 12
            console.log(username)
            password = await bcrypt.hash(password,salt)
            const newUser = new User({
                email:email,
                username:username,
                password:password,
                createdAt:new Date().toISOString()
            })
            const res = await newUser.save()
            const token = generateToken(res)
            return{
                ...res._doc,
                id:res._id,
                token
            }
        }
    }
};

export default userResolvers
