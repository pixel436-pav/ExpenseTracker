import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

// this function will generate a jwt token 
const generateToken = (id: string): string => {
    // logic- to generate a token containing User Id

    return jwt.sign({ id }, // payload : Data You want to store 
        process.env.JWT_SECRET as string, // Secret : Used to sign in 
        { expiresIn: '30d' }) // token expires in 30d
    //jwt.sign (payload,secret,options)

}

// register - Create New User account 

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        // Check if the user already exists 
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(404).json({ message: 'User Already Exists' })
        }

        // below step will create a user - trigger mongoose call the function and store eveything in database
        const user = await User.create({ name, email, password })

        // below will generate a jwt token 
         const token = generateToken(user._id.toString())


        // will send a response conatinaing token 
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : token // generatedtoken
            

        })
       
    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }

};

export const loginUser = async (req:Request,res:Response) => {
  try {
    const {email,password} = req.body;
    // find user by email 
    const user = await User.findOne({email});
    if (user && (await user.matchPassword(password))){

        // above will triger that password matching function that we wrote in mongoose to match the password with the hashed password 

        const token = generateToken(user._id.toString());

        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : token
        });

    }else {
        res.status(401).json({message: 'Invalid Email or password'})
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// GET ME - which will get the current user's profile

export const getMe = async (req:Request,res:Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    res.json(user);
  } catch (error) {
    
    res.status(500).json({message:'Server Error'});

  }
}


