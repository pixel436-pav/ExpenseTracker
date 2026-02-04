import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

interface AuthRequest extends Request {
    user? : any; // this tells type script that don't thow any error i am going to extend the req object later 
}


// Middle Ware For the protection ( this requires authentication )
export const protect = async (  req: AuthRequest,
                                res: Response,
                                next : NextFunction) => {
                                    let token ;
// Check if authorization header exists
// frontend sends Authorization : bearer 

if ( req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
    try {
        // extract token from the header
        // "Bearer wljwehbql..." --> split by space --> get second part 

        token = req.headers.authorization.split(' ')[1];
        console.log('token receieved: ',token)     
         // STEP 3: Verify token signature
      // HOW jwt.verify() WORKS:
      // 1. Splits token into header.payload.signature
      // 2. Re-creates signature using header + payload + JWT_SECRET
      // 3. Compares new signature with token's signature
      // 4. If they match → token is valid and hasn't been tampered with
      // 5. If they don't match → token is fake or modified
        
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {id:string};
      console.log('decoded payload: ',decoded)

      // STEP 4: Get user from database using ID from token
      req.user = await User.findById(decoded.id).select('-password');

      console.log('User Attached to request: ',req.user);
       // { _id: "65abc123...", name: "John", email: "john@test.com" }

      // STEP 5: Continue to next middleware/controller
      next();


      
    } catch (error) {
            console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }

}   
    // if no token found in header
     if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }

  
}

