function validateInput({ username, email, password }) {
  const regexUsername = /[^\w]/g,
    regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if ([username.trim(), email.trim(), password.trim()].includes("")) {
    return {
      valid: false,
      message: "invalid credentials",
    };
  }

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
  if (email.length > 20 || !regexEmail.test(email)) {
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
  regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if ([email.trim(), password.trim()].includes("")) {
    return {
      valid: false,
      message: "invalid credentials",
    };
  }
  if (email.length > 20 || !regexEmail.test(email)) {
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

module.exports = { validateLogin, validateInput, removeEmptyValues };
