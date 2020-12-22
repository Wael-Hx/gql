const { AuthenticationError, ApolloError } = require("apollo-server");
const Profile = require("../../db/models/Profile");

module.exports = {
  Query: {
    getProfileById: async (_, { id }) => {
      try {
        const profile = await Profile.findOne({ user: id }).populate("user", [
          "_id",
          "username",
          "createdAt",
          "updatedAt",
        ]);
        if (!profile) {
          return new ApolloError("cannot get profile");
        }
        return profile;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    myProfile: async (_, __, { userId }) => {
      if (!userId) {
        return new AuthenticationError("not authorized");
      }
      try {
        const profile = await Profile.findOne({ user: userId }).populate(
          "user",
          ["_id", "username", "createdAt", "updatedAt"]
        );
        return profile;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
  },
  Mutation: {
    createProfile: async (_, { userProfile }, { userId }) => {
      if (!userId) {
        return new AuthenticationError("not authorized");
      }
      try {
        const newProfile = new Profile({ user: userId, ...userProfile });
        await newProfile.save();
        const profile = await newProfile
          .populate("user", ["_id", "username", "createdAt", "updatedAt"])
          .execPopulate();
        return profile;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    updateProfile: async (_, { userProfile }, { userId }) => {
      if (!userId) {
        return new AuthenticationError("not authorized");
      }
      try {
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: userId },
          { $set: userProfile },
          { new: true }
        );
        await updatedProfile.save();
        const profile = await updatedProfile
          .populate("user", ["_id", "username", "createdAt", "updatedAt"])
          .execPopulate();
        return profile;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
  },
};
