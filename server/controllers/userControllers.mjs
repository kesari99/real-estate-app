import bcryptjs from 'bcryptjs'
import User from "../models/user_models.mjs"
import { errorHandler } from '../utils/error.mjs'

export const testRoute  = (req, res) => {
    res.send('Hello World')
    
}

export const updateUser = async (req, res, next) => {

    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'))

        try{
            if(req.body.password ){
                req.body.password = bcryptjs.hashSync(req.body.password, 10)
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                 $set: {username: req.body.username,
                 email : req.body.email,
                 password:req.body.password,
                 avatar: req.body.avatar
                 }
            }, {new: true})

        console.log(updatedUser)

        const {password, ...rest} = updatedUser._doc

        res.status(200).json(rest)

        }catch(err){
            next(err)
        }
    
}