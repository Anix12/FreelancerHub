const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  profile_image: {
    url: {
      type: String,
      default:'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?cs=srgb&dl=daylight-environment-forest-459225.jpg&fm=jpg'
    }
  },
  budget: {
    currency: {
      type: String,
      required: true,
      default: 'USD'
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  skills: [{
    type: String,
    required: true,
    trim: true
  }],
  postedby: {
    type: String,
    default: 'Anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for search functionality
workSchema.index({ title: 'text', description: 'text' });

// Add virtual for formatting deadline
workSchema.virtual('formattedDeadline').get(function() {
  return this.deadline.toLocaleDateString();
});

const Work = mongoose.model('Work', workSchema);

module.exports = Work;