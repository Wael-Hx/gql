const {
  AuthenticationError,
  ApolloError,
  UserInputError,
} = require("apollo-server");
const Profile = require("../../db/models/Profile");
const { removeEmptyValues } = require("../../utils/validateInput");

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
      if (userProfile.displayName.length > 20) {
        return new UserInputError("display name is more than 20 characters");
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
      if (userProfile.displayName.length > 20) {
        return new UserInputError("display name is more than 20 characters");
      }
      const formattedProfile = removeEmptyValues(userProfile);
      if (Object.keys(formattedProfile).length === 0) {
        return new UserInputError("cannot update an empty profile");
      }
      try {
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: userId },
          { $set: formattedProfile },
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
