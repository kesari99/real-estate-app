import User from "../models/user_models.mjs"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.mjs"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body
    const hashedPassword =  bcryptjs.hashSync(password,10 )
    const newUser = new User({username, email, password:hashedPassword})
    try{
        await newUser.save()
        res.status(201).json('User created Successfully')
    }catch(err){
        next(err)

    }
    
   
   
}


export const signin = async (req, res, next) => {
    const {email,password} = req.body

    try{
        const validUser = await User.findOne({email})

        if(!validUser){
            return next(errorHandler('404', 'User not found'))
        }

        const isValidPassword = bcryptjs.compareSync(password, validUser.password)

        if(!isValidPassword){
            return next(errorHandler('401',  'Wrong Credentials'))
        }

        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        const {password: pass, ...user} = validUser._doc
        res.cookie('access_token', token,{ httpOnly: true, secure: false, sameSite: 'Strict' }).status(200).json(user)    

    }catch(err){
        next(err)
    }
}