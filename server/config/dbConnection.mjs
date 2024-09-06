import mongoose from "mongoose";

export const connectToDb = async () => {
    try{
       const connect=  await mongoose.connect(process.env.MONGO)
       console.log(`Database connected to ${connect.connection.host} ${connect.connection.name}`)
    }catch(err){
        console.log(err)
        process.exit(1)

    }
}