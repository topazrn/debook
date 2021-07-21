function submits(event) {
  event.preventDefault();

  const fields = {};
  let fieldElements = [...document.querySelectorAll("form [name]")];
  fieldElements.forEach(input => {
    if (input.getAttribute("name") === "eula") {
      fields[input.getAttribute("name")] = input.checked;
    } else {
      fields[input.getAttribute("name")] = input.value.trim();
    }
  });

  let valid = validate(
    fields.email,
    fields.password,
    fields.confirm_password,
    fields.eula
  );

  if (valid) addUser(
    fields.email,
    fields.password,
    fields.eula
  );
}

function validate(email, password, confirm_password, eula) {
  // Email
  if (email === "") {
    alert("Email must be filled.");
    return false;
  }
  if (email.indexOf("@") == -1) {
      alert(`Email must contain "@".`);
      return false;
  }
  if (!email.endsWith(".com")) {
      alert(`Email must ends with ".com".`);
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

  // Confirm Password
  if (password !== confirm_password) {
    alert("Confirm Password does not match with Password.");
    return false;
  }

  // Eula
  if (!eula) {
    alert("You must agree to the terms and conditions to be able to register.");
    return false;
  }

  return true;
}

function addUser(email, password, eula) {
  db.insert("users", {
    "id": `${email}:${password}`,
    "logged_in": true,
    "aggree_to_eula": eula,
    "has_done_tutorial": false,
    "persons": [],
  }, () => {
    window.location.href = getHomeUrl();
  });
}