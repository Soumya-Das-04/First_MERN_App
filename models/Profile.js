const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    //creating a reference to the user model as every profile should be associated with a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    company : {
        type: String
    },
    location: {
        type: String

    },
    status: {
        type: String,
        required: true

    },
    skills:{
        type: [String],
        required: true

    },
    bio: {
        type: String

    },
    githubusername: {
        type: String

    },
    experience: [
        {
          title: {
            type: String,
            required: true
          },
          company: {
            type: String,
            required: true
          },
          location: {
            type: String
          },
          from: {
            type: Date,
            required: true
          },
          to: {
            type: Date
          },
          current: {
            type: Boolean,
            default: false
          },
          description: {
            type: String
          }
        }
      ],
      education: [
        {
          school: {
            type: String,
            required: true
          },
          college: {
            type: String,
            required: true
          },
          fieldofstudy: {
            type: String,
            required: true
          },
          from: {
            type: Date,
            required: true
          },
          to: {
            type: Date
          },
          current: {
            type: Boolean,
            default: false
          },
          description: {
            type: String
          }
        }
      ],
      social: {
        youtube: {
          type: String
        },
        twitter: {
          type: String
        },
        facebook: {
          type: String
        },
        linkedin: {
          type: String
        },
        instagram: {
          type: String
        }
      },
      date: {
        type: Date,
        default: Date.now
      }
})

module.exports = Profile = mongoose.model("profile",profileSchema)