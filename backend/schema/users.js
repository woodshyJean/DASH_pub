const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({ //creating a schema
    name: String,  //key of keyvalue pair : type of value
    age: {type: String, required: true, lowercase: true, min:1, max: 100,},
    email: {type: String, minLength:10, validate: {
        validator: v => v % 2 === 0,
        message: props => `${props.value} is not a even number`
    }},
    createdAt: {type: Date, default: () => Date.now(), immutable: true},
    updatedAt: Date,
    bestFriend: {type: mongoose.SchemaTypes.ObjectId, ref : "User"},
    hobbies: [String],
    address:{
        street: String,
        city: String,
    }

})

const dashUserSchema = new mongoose.Schema({ //creating a schema
    id: String,
    logedIn:{type:Boolean},
    name: String,  //key of keyvalue pair : type of value
    age: {type: String, required: true, lowercase: true, min:1, max: 100,},
    email: {type: String, required: true},
    password: {type:String, required:true},
    createdAt: {type: Date, default: () => Date.now(), immutable: true},
    updatedAt: Date,
    todos: {},
    goals: {},
    flashCardSets:{}
    /*bestFriend: {type: mongoose.SchemaTypes.ObjectId, ref : "User"},*/
    /*hobbies: [String],
    address:{
        street: String,
        city: String,
    }*/

})


module.exports = mongoose.model("User", dashUserSchema) //creating and exporting a mongoose model