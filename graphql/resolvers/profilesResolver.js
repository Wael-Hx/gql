const Profiles = require("../../models/profiles");

module.exports = {
  Query: {
    getProfileById: async (_, { id }) => {
      let profile = await Profiles.getProfileById(id);
      return profile;
    },
    myProfile: async (_, __, { userId }) => {
      let myProfile = await Profiles.getMyProfile(userId);
      return myProfile;
    },
    getAllProfiles: async () => {
      let profiles = await Profiles.getAllProfiles();
      return profiles;
    },
  },
  Mutation: {
    createProfile: async (_, { userProfile }, { userId }) => {
      const myProfile = await Profiles.createMyProfile(userProfile, userId);
      return myProfile;
    },
    updateProfile: async (_, { userProfile }, { userId }) => {
      const myProfile = await Profiles.updateMyProfile(userProfile, userId);
      return myProfile;
    },
  },
};
