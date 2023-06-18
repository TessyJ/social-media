const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true
        },
        email: {
            type: String, 
            required: true, 
            unique: true, 
            // remove the array and second argument?
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
              },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
              },
        ]
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    }
  );

  // Create a virtual property `friendCount` that gets the # of user's friends
  userSchema
  .virtual('friendCount')
// is this correct?? 
  .get(function () {
    return this.friends.length;
  })

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;