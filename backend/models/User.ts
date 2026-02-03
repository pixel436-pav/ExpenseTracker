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

// UnderStand The Logic later 

UserSchema.pre('save', async function (this:IUser,next){
    if(!this.isModified('password')){
        return // next(); this is not required in modern mongoose 
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
   
})

UserSchema.methods.matchPassword = async function(this:IUser,enteredPassword:string):Promise<boolean>{
    return await bcrypt.compare(enteredPassword,this.password);
};

export default mongoose.model<IUser>('User',UserSchema)