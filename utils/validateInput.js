function validEmail(email) {
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    !email ||
    typeof email !== "string" ||
    !regexEmail.test(email) ||
    email.length > 20
  ) {
    return false;
  } else {
    return true;
  }
}

function validateInput({ username, email, password }) {
  const regexUsername = /[^\w]/g;

  if (
    username.length > 10 ||
    regexUsername.test(username) ||
    username.length < 2
  ) {
    return {
      valid: false,
      message: "invalid username",
    };
  }
  if (password.length < 6 || password.length > 20) {
    return {
      valid: false,
      message: "min password length is 6",
    };
  }
  if (!validEmail(email)) {
    return {
      valid: false,
      message: "invalid email",
    };
  }
  return {
    valid: true,
    message: "",
  };
}

function validateLogin({ email, password }) {
  if (!validEmail(email)) {
    return {
      valid: false,
      message: "invalid email",
    };
  }
  if (password.length < 6 || password.length > 20) {
    return {
      valid: false,
      message: "min password length is 6",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

const removeEmptyValues = (obj) => {
  Object.keys(obj).forEach((k) => obj[k] === "" && delete obj[k]);
  return obj;
};

module.exports = {
  validateLogin,
  validateInput,
  removeEmptyValues,
  validEmail,
};
