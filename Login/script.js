function submits(event) {
  event.preventDefault();

  const fields = {};
  let fieldElements = [...document.querySelectorAll("form [name]")];
  fieldElements.forEach(input => {
    fields[input.getAttribute("name")] = input.value.trim();
  });

  let valid = validate(
    fields.email,
    fields.password
  );

  if (valid) login(
    fields.email,
    fields.password,
  );
}

function validate(email, password, confirm_password, eula) {
  // Email
  if (email === "") {
    alert("Email must be filled.");
    return false;
  }

  // Password
  if (password === "") {
    alert("Password must be filled.");
    return false;
  }
  if (password.length < 8 || password.length > 10) {
    alert("Password length must be between 8 (inclusive) and 10 (inclusive).");
    return false;
  }
  let hasUppercase = false;
  for (let index = 0; index < password.length; index++) {
    const character = password[index];
    if (isUpperCase(character)) {
      hasUppercase = true;
      break;
    }
  }
  if (!hasUppercase) {
    alert("Password must contain uppercase letter.");
    return false;
  }
  let hasLowercase = false;
  for (let index = 0; index < password.length; index++) {
    const character = password[index];
    if (isLowerCase(character)) {
      hasLowercase = true;
      break;
    }
  }
  if (!hasLowercase) {
    alert("Password must contain lowercase letter.");
    return false;
  }
  let hasNumber = false;
  for (let index = 0; index < password.length; index++) {
    const character = password[index];
    if (isNumber(character)) {
      hasNumber = true;
      break;
    }
  }
  if (!hasNumber) {
    alert("Password must contain a number.");
    return false;
  }

  return true;
}

function login(email, password) {
  db.get("users", `${email}:${password}`, user => {
    console.log(user);
    console.log(user != undefined);
    if (user != undefined) {
      user.logged_in = true;
      db.update("users", user.id, user, () => {
        authCheck();
      });
    } else {
      alert("Login or password invalid.")
    }
  });
}