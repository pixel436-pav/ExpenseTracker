import mongoose , {Document,Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document{
    name: string ;
    email: string;
    password : string;
    createdAt : Date;
    matchPassword(enteredPassword:string):Promise<boolean> // the Promise written hear tell that the function hear will take some time - it is Asychronous (an once completed will return a boolean)

}

const UserSchema = new Schema <IUser>({
    name:{
        type : String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required: true,
        minlength : 6
    }
},
{timestamps:true})

// This is the middleWare runs before saving the user to database 

UserSchema.pre('save', async function (this:IUser,next){
    if(!this.isModified('password')){
        return // next(); this is not required in modern mongoose 
    };
    // this below which we call a salt is a random data that is going to append everytime to hashed password to add another layer of security to save our data form pre - calculated hashed passwword rainbow tables , that hackers use to attack dataBase 
    const salt = await bcrypt.genSalt(10); // salt = "$2a$10$N9qo8uLOickgx2ZMRZoMye"  (random every time)
    // this under hashes the entered password and appends the salt 
    this.password = await bcrypt.hash(this.password,salt);
    // Result: "$2a$10$N9qo8uLOickgx2ZMRZoMye/IjSF9JHzP1vpoJdYCpcBNC0gqQZ6Qa"

    // This hashed version is what we store in DB
   
})

// CUSTOM METHOD: Compare entered password with stored hash
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  // LOGIC: bcrypt extracts the salt from the stored hash and compares
  // User enters: "mypass123"
  // DB has: "$2a$10$N9qo8uLOickgx2ZMRZoMye/IjSF9JHzP1vpoJdYCpcBNC0gqQZ6Qa"
  
  // bcrypt:
  // 1. Extracts salt from stored hash
  // 2. Hashes entered password with that same salt
  // 3. Compares the two hashes
  // 4. Returns true if they match
    return await bcrypt.compare(enteredPassword,this.password);
};

export default mongoose.model<IUser>('User',UserSchema)