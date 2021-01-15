const nodemailer = require("nodemailer");

const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("test account created : %s", testAccount);
    console.log("test account options : %s", testAccount.smtp);
    return testAccount;
  } catch (err) {
    console.log(err.message);
    return process.exit(1);
  }
};

module.exports = createTestAccount;
