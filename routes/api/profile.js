const express = require('express')
const router = express.Router()
const request = require("request")
const config = require("config")
const auth = require("../../middleware/auth")
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {
    check,
    validationResult
} = require('express-validator');

//@route   GET api/profile/me
//@desc    Get Curent users profile
//@acess   private
router.get('/me',auth, async (req,res) => {
try{

const profile = await Profile.findOne({user: req.user.id}).populate("user",["name","avatar"])

if(!profile){
   return res.status(400).json({msg: "There is no profile for this user"})
}

res.json(profile)

}catch(err){
    console.error(err)
    res.status(500).send("server Error")
    
}
})

//@route   POST api/profile/me
//@desc    Create or Update users profile
//@acess   private

router.post("/", [auth,[
    check("status","Status is required").not().isEmpty(),
    check("skills","Skils is required").not().isEmpty()
]], async (req,res) => {
    
    const errors = validationResult(req);
           
    if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
                  });
            }

    const {

        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin

    } = req.body

    // Build profile Objects

    const profileFields = {}
    profileFields.user = req.user.id
    
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
        profileFields.skills = skills.split(",").map(skill => skill.trim())
    }

    //Build Social Objects
    profileFields.social = {} //need to initialise else will throw undefined error
    if(youtube) profileFields.social.youtube = youtube
    if(twitter) profileFields.social.twitter = twitter
    if(linkedin) profileFields.social.linkedin = linkedin
    if(instagram) profileFields.social.instagram = instagram
    if(facebook) profileFields.social.facebook = facebook

    console.log(profileFields)

    try {

        let profile = await Profile.findOne({ user: req.user.id})

        //if user then update user
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
                )

            return res.json(profile)
        }
        
        //if not user then create user
        profile = new Profile(profileFields)

        await profile.save()
        
        res.json(profile)



    }catch(err){
        console.error(err)
        res.status(500).send("server Error")
        
    }



})


//@route   GET api/profile
//@desc    Get all profiles
//@acess   public

router.get("/", async (req, res) => {

    try {
        
        const profiles = await Profile.find().populate('user',["name","avatar"])
        res.json(profiles)



    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
        
    }
})

//@route   GET api/profile/user/:user_id  //colon before user_id bcz it's a placeholder
//@desc    Get profiles by user_id
//@acess   public

router.get("/user/:user_id", async (req, res) => {

    try {
        
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',["name","avatar"])

       if(!profile){
        return res.status(400).send({msg: "No User found for this profile"})
       }

        res.json(profile)



    } catch (err) {
        console.error(err.message)
        if(err.kind == "ObjectId"){
            return res.status(400).send({msg: "No User found for this profile"})
        }
        res.status(500).send("server error")
        
    }
})

//@route   DELETE api/profile
//@desc    Delete profile,user &posts
//@acess   private

router.delete("/", auth, async (req, res) => {

    try {
        //@todo - remove posts is later videos
        // Removing Profile
        await Profile.findOneAndRemove({user: req.user.id})
        
        // Removing the User
        await User.findOneAndRemove({_id: req.user.id})
        
        res.json({msg: "User Deleted"})



    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
        
    }
})


//@route   PUT api/profile/experience
//@desc    Add Pofile Experience
//@acess   private

router.put("/experience",[auth,
    [
    check("company","Company is required").not().isEmpty(),
    check("title","Title is required").not().isEmpty(),
    check("from","from Date is required").not().isEmpty()

]], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errrs: errors.array()})
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } // create an object with the ata the user submits

    try {
        
        const profile =  await Profile.findOne({user: req.user.id})

        profile.experience.unshift(newExp)   //unshift works same as push but pushes at the begining of the array mot the end
                                      //experience is an array
        await profile.save()
        res.json(profile) // returning whole profile

    } catch (err) {

        console.error(err.message)
        res.status(500).send("Server Error")
        
    }

})

//@route   DELETE api/profile/experience/:exp_id
//@desc    Delete Pofile Experience
//@acess   private

router.delete("/experience/:exp_id", auth, async (req, res) => {

    try {
        
        const profile =  await Profile.findOne({user: req.user.id})
        
        // Get Remove Index
       const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

       profile.experience.splice(removeIndex,1)

       await profile.save()
        
        res.json(profile)



    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
        
    }
})


//@route   PUT api/profile/education
//@desc    Add Pofile Education
//@acess   private

router.put("/education",[auth,
    [
    check("school","school is required").not().isEmpty(),
    check("college","college is required").not().isEmpty(),
    check("fieldofstudy","Field of study is required").not().isEmpty(),
    check("from","from Date is required").not().isEmpty()

]], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errrs: errors.array()})
    }

    const {
      school,
      college,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body

    const newEdu = {
        school,
      college,
      fieldofstudy,
        from,
        to,
        current,
        description
    } // create an object with the ata the user submits

    try {
        
        const profile =  await Profile.findOne({user: req.user.id})

        profile.education.unshift(newEdu)   //unshift works same as push but pushes at the begining of the array mot the end
                                      //experience is an array
        await profile.save()
        res.json(profile) // returning whole profile

    } catch (err) {

        console.error(err.message)
        res.status(500).send("Server Error")
        
    }

})

//@route   DELETE api/profile/education/:edu_id
//@desc    Delete Pofile Education
//@acess   private

router.delete("/education/:edu_id", auth, async (req, res) => {

    try {
        
        const profile =  await Profile.findOne({user: req.user.id})
        
        // Get Remove Index
       const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

       profile.education.splice(removeIndex,1)

       await profile.save()
        
        res.json(profile)



    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
        
    }
})

//@route   GET api/profile/github/:username
//@desc    Get Github Profile
//@acess   public

router.get("/github/:username", (req,res) => {
    try {
        
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
            &client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: {"user-agent": "node.js"}
        }
        
        request(options, (error, response, body) => {
            if(error) console.error(error)

            if(response.statusCode !== 200) {
                return res.status(404).json({msg: "No Github Profile found"})
            }

            res.json(JSON.parse(body))
        })

        

    } catch (err) {
        
        console.error(err.message)
        res.status(500).send("Server Error")
        
    }
})

module.exports = router