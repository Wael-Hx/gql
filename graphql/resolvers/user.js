const User = require("../../db/models/User");

module.exports = resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    async register(
      _,
      { credentials: { username, email, password } },
      context,
      info
    ) {
      try {
        const newUser = new User({ username, email, password });
        const res = await newUser.save();
        return {
          ...res._doc,
          id: res._id,
        };
      } catch (err) {
        console.error(err);
      }
    },
  },
};
