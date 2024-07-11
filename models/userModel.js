import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', ''],
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required:true
    },
    address:{
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0,
      },
    isActive: {
        type: String,
        default: "Active",
      },
}, {timestamps: true});

export default mongoose.model('users',userSchema)