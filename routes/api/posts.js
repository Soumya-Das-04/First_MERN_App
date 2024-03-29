const express = require('express')
const router = express.Router()
const {
    check,
    validationResult
} = require('express-validator');
const auth = require("../../middleware/auth")

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//@route   POST api/posts
//@desc    Create a post
//@acess   private
router.post('/',[auth,[
    check("text","Text is required").not().isEmpty()
]], 
async (req,res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    
    
    try {
        const user = await User.findById(req.user.id).select("-password")
        
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        

        const post = await newPost.save()
        res.json(post)


    } catch (err) {

        console.error(err.message)
        res.status(500).send("Sereer Error")
        
    }
})


//@route   POST api/posts
//@desc    Get all Posts
//@acess   private

router.get("/",auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1})     // -1 for the newest first
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Sereer Error")
    }
})

//@route   POST api/posts/:id
//@desc    Get a single post by ID
//@acess   private

router.get("/:id",auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post){
           return res.status(400).json({msg: "Post not Found"})
        }
        
        res.json(post)
    } catch (err) {
        console.error(err.message)

        if(err.kind === "ObjectId"){
            return res.status(400).json({msg: "Post not Found"})
         }
        res.status(500).send("Sereer Error")
    }
})

//@route   Delete api/posts/:id
//@desc    Delete Posts
//@acess   private

router.delete("/:id",auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id) 

        
        if(!post){
            return res.status(400).json({msg: "Post not Found"})
         }
        
        // Check The user
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not Authorised"})
        }

        await post.remove()

        res.json({msg: "Post removed"})
    } catch (err) {
        console.error(err.message)

        if(err.kind === "ObjectId"){
            return res.status(400).json({msg: "Post not Found"})
         }
        res.status(500).send("Sereer Error")
    }
})

module.exports = router