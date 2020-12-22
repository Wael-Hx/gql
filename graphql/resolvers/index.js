const postResolvers = require("./postResolvers");
const profilesResolver = require("./profilesResolver");
const userResolver = require("./userResolver");

module.exports = [userResolver, postResolvers, profilesResolver];
