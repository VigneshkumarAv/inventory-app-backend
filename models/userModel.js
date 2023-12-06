const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a vaid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: [6, "Password must be upto 6 Characters"],
       // maxLength: [23, "Password must not be more than 23 Characters"],
    },
    photo: {
        type: String,
        //required: [true, 'Please add a photo'],
        default: 'https://i.ibb.co/4pDNDk1/avatar.png'
    },
    phone: {
        type: String,
        default: "+91"
    },
    bio: {
        type: String,
        default: "bio",
        maxLength: [250, "Bio must not be more than 250 characters"]
    }    
},{
    timestamps: true
})

//Encrypt password before saving to DB

userSchema.pre("save",async function (next) {

    if(!this.isModified("password")){
        return next()
    }
    //Hash password
    const salt = await bcrypt.genSalt(10) // this is method 2 of encrypt password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next()
})

const User = mongoose.model("User",userSchema);
module.exports = User;