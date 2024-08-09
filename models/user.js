import {Schema, model,models} from 'mongoose';

//1. Create a Schema 

const UserSchema = new Schema (
 {
    email  : {
        type:String,
        unique : [true , 'Email Already exists'],
        required : [true, 'Email is required'],
    },
    username : {
        type:String,
        required : [true, 'Username is required'],
        match: [/^[a-zA-Z0-9._]{5,20}$/, "Username invalid, it should contain 5-20 alphanumeric letters and be unique!"]
    },
    image : {
        type : String,
    }
 }
);

// 2.Create a Model

const User  = models.User  || model("User",UserSchema); // checks if there is already User model exists in models ; if it doesnt then creates a model

export default User ; 