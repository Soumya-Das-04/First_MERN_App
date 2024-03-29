const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    text: {
        type: String,
        required: "true"
    },
    name: {
        type: String
    },
    avatart: {
        type : String
    },
    likes: [
       {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        }
       } 
    ],
    comments: [
        {
         user: {
             type: Schema.Types.ObjectId,
             ref: "users"
         },
         texts:{
            type: String,
            required: true
         },
         date:{
            type: Date,
            default: Date.now
         }
        } 
     ],
     date:{
        type: Date,
        default: Date.now
     }
})

module.exports = Post = mongoose.model("Post",PostSchema) 