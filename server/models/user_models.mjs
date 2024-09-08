import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    avatar: {
        type:String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAACUCAMAAABVwGAvAAAAOVBMVEX///+ZmZm0tLSUlJSRkZGOjo7q6ur8/Pynp6ecnJyhoaHZ2dnLy8vV1dXz8/Oqqqrj4+PCwsK6urrrRaL7AAAFRklEQVR4nO1c25arIAythoJaQPT/P/ZonZl6QRIC2vPAXvM2U2YTciWhj0dBQUFBQUFBQUFBwbWQzuhhfGPQxslv8/mFsk7XrZgAAFU1/4AAIdpeO6u+TG6i1k3EKg8mkl2t3deoKam76i2yU0y/7LT8hgytqYUIMPuDELWx02buJKd0ExTbVoZVo+9kZzWQBLcSIWh7FzvTkQW3EmFnbiHnOOQWgtebsR3oOnfgB8PFKii5ovsV4KXhRPNF90tQX0ZOjZH26oMYLzrgxIP9xXzAFzDMxO4iBXR5uC1wueXnMqjdByKzB3RtTnZV1Wbl5zKp3Qcio/7ZXFbxAXTZUgTb0NjBD2h/3OThpx415R/Csx21MUZPlceT9IE6C70pkuF2AdUofwsfZeVYEQjmiG+KYhZQDbuTsgNFfjnMt0XpiUMip+YgIzChQ5vObkTZwZj7k3TgsUxMOaY3RKkBjzSJx6tQjxeSACo/aNJir0YF0Af+geqxT4uk+sh22PoQDE4SVb+k4DGgpzMgC2DSxxYIwaL+uEU2n75CAMMzce8Kl79gi09hOyc4BkKSzTVegys2urTCjUvzMnvVo/QISQee7oRcUwD4uVDMDlU+xDedAo+ZFKdqUMfOjLyo8Crxwld5EUo8DjuHeZVs9J6cxABXmkyHy4oceDinpeOakNYzbFcSCm9KNVPjy1RtvO2+KNUWnq6phrAMEHR4B4LqVXmCGkf5FK24RZWPonqTksQqn6Ld+WDZJJ7PvtHG0rO0CzOBiA8vBpZlYpM+iTvlBcGFLXGRaMdM8KZvBNWGpsAVoyIiqfSbX+B4syziBZ6u4DunngAjaaEeS2DrmrwCKa/dgBBxV3v32Ieiy39CH0mPEos+/NrXzkCUwS+21miupDcR7Nf9bmXwMuVWevPIQKNfTkrndEMbMriV3jK/8p4Pif9oNL0Y08iAWNOIogdCPHc4mb3JRY/s9wCgrd9at4Z76bGjtjiqeL9H9FrQjeY0KbBm7GhGEh01SOFStBqpEqRpKQSxvOwAQnkKDWlRytQLpWDebhvN97yhzAeLK8oztlSzyJJTHKMv9kK3GpstI/dy0ETtVyI9TfyecE8v6Fmiu53hnmt8pRY0XYiNQRNCSQKjNxlqRHKaEaGOOqM1GahQoxV5WfCcHme7p6cBzEbT+U06py9+pnwMPV5wam2strg9ccz8Ns5Zi+jJWtG/GL+Lc3rrxWuK+8vU6NuaFfz3Skxd9t6PpnQQT8THuBt9Y8y41gLfjtmm5vPMsVn3Dp4agT8uctxr6miM576PPy1yzEl5PuCDo7eaMlGusR3zDEhj93gcFuRPeqljHEpUPU+oTBnF2Hcl0tzKjL1rSRtk2Y2Mpg+N7SJ56hDptoyJrqgO2Fpb8hDV1pEyukt7epvtpjn5GZvIm4Pear9pI0oL1raWlx4k+4HHNqvPSy/P8O0q9KaPU7oVvUyj1atA2deJ+OQE0dc+p4jqARCRPpj5B8I8UDQ75uyPnx9x7pvOLnEqc0OOPpdOZpf5UZ2N6/Ig7KJvpHB+EU1AjF1/wYNE1Wd68CJyWsUKtNkRDOk54wmUIb10CJMT++ZlRmCXsDi7uEvfWKgx6RniZU/8/sB+//rzAvZqfmrguUBor37++gNZx5sIPOv7vkpB1pTHQCty1Y3kZriB/npdwHD/tydYTZoum7844bZH9Vu4oQ+ODky/7L8guA+s1L0QwqOJAEL0Wn5JcGtIM9RN030eIbZdXw/mv/nSkwnWSudeM5xz0v4HQlvj5C1YQUFBQUFBQUFBQRD/AAHhOpNriU7uAAAAAElFTkSuQmCC"
    }
    
}, {timestamps:true})

const User = mongoose.model("User", userSchema)

export default User