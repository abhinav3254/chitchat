const { Schema, model } = require('mongoose');


/**
 * creating user schema
 */
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


// here "user" is the name of collection in the db
const UserModel = model("user", UserSchema);

module.exports = UserModel;