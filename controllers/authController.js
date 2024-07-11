import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";


//registration
export const registerController =async(req,res) =>{
    try{
        const {name, gender, email, password,phone,address} = req.body;
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!gender){
            return res.send({message:'gender is Required'})
        }
        if(!email){
            return res.send({message:'email is Required'})
        }
        if(!password){
            return res.send({message:'password is Required'})
        }
        if(!phone){
            return res.send({message:'phone is Required'})
        }
        if(!address){
            return res.send({message:'address is Required'})
        }
        //check user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success: false,
                message:'Already Register Please login'
            })
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save 
        const user = await new userModel({name, gender, email,phone,address, password:hashedPassword}).save()
        res.status(201).send({
            success:true,
            message: 'User Register Sucessfully',
            user

        })

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message:'Error in Registeration',
            error
        })
    }
};
//login

export const LoginController = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message: 'Invalid email or password'
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Email is not registered '
            })
        }
        const match = await comparePassword(password, user.password )
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "7d",
        });
        res.status(200).send({
            success:true,
            message: "Login Sucessfully",
            user:{
                Name: user.name,
                gender: user.gender,
                address: user.address,
                email: user.email,
                phone: user.phone,
                role: user.role,
                },
                token,
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Login failed",
            error
        })
    }
};


//update profile

export const updateProfileController = async (req, res) => {
    try {
        const { name, phone, address, gender, email, password } = req.body;
        const user = await userModel.findById(req.params.id);

        // Password
        if (password && password.length < 6) {
            return res.json({ error: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
            name: name || user.name,
            phone: phone || user.phone,
            address: address || user.address,
            gender: gender || user.gender,
            email: email || user.email,
            password: hashedPassword || user.password,
        }, { new: true });

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
            message: "Error while updating profile",
        });
    }
}; 
export const allUsers = async (req,res) =>{
    try {
        const users = await userModel.find();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}
export const delUser = async (req,res) =>{
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).send({
            success: true,
            message: "user deleted",
            user
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}


