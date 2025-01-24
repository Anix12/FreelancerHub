const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let freelancerSchema = new Schema({
     name:{type: String,
        required: true,
     },
     image: {
      url: String,
      filename: String,
     },
     email: { 
      type: String, 
      required: true, 
      unique: true, 
      validate: {
          validator: function (v) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: props => `${props.value} is not a valid email address!`
      }
   },
     phone:{type: Number,
     },
     role:{type: String,
        required:true,
     },
     rate:{type: Number,},
     skills: [{type: String}],
     portfolio: [
        {
            type: Schema.Types.ObjectId,
            ref: "Portfolio",
        },
     ],
    experience: [{type: Schema.Types.ObjectId,
        ref: "Experience",
              }
       ],
       certification: [
        {type:Schema.Types.ObjectId,
            ref: "Certification",
         },
       ]
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;
  
  