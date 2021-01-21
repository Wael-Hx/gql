const {
  ApolloError,
  AuthenticationError,
  UserInputError,
} = require("apollo-server");
const Profile = require("../db/models/Profile");
const { removeEmptyValues } = require("../utils/validateInput");

const getProfileById = async (id) => {
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
};
const getMyProfile = async (userId) => {
  if (!userId) {
    return null;
  }
  let profile = await getProfileById(userId);
  return profile;
};
const getAllProfiles = async () => {
  try {
    const profiles = await Profile.find().populate("user", [
      "_id",
      "username",
      "createdAt",
      "updatedAt",
    ]);
    return profiles;
  } catch (err) {
    console.error(err);
    return null;
  }
};
const createMyProfile = async (userProfile, userId) => {
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
};
const updateMyProfile = async (userProfile, userId) => {
  if (!userId) {
    return new AuthenticationError("not authorized");
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
};

module.exports = Profiles = {
  getAllProfiles,
  getMyProfile,
  getProfileById,
  createMyProfile,
  updateMyProfile,
};
