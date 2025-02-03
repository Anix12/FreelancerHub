const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let contactSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, validate: {
        validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
    }},
    message: {type: String, required: true},
    createdAt: {
        type: Date,
        default: Date.now
      }
});





const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;