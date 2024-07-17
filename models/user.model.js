import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unigue: true
    },
    email: {
        type: String,
        required: true,
        unigue: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-8110251-6515860.png?f=webp",
    },

}, {timestamps:true});

const User = mongoose.model('User', userSchema);

export default User