const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email',
      },
      required: [true, 'Email required'],
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thoughts' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
