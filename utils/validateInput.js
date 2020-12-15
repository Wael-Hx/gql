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
    regexUsername.test(username) ||
    username.length > 10 ||
    username.length < 4
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
  if (!regexEmail.test(email)) {
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
  if (!regexEmail.test(email)) {
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

module.exports = { validateLogin, validateInput };
