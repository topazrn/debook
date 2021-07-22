function submits(event) {
  event.preventDefault();

  const fields = {};
  let fieldElements = [...document.querySelectorAll("form [name]")];
  fieldElements.forEach(input => {
    if (input.getAttribute("name") === "eula") {
      fields[input.getAttribute("name")] = input.checked;
    } else {
      fields[input.getAttribute("name")] = input.value;
    }
  });

  let valid = validate(
    fields.name,
    fields.address,
    fields.dob,
    fields.phone,
    fields.email,
    fields.password,
    fields.confirm_password,
    fields.eula
  );

  if (valid) addUser(
    fields.name,
    fields.address,
    fields.dob,
    fields.phone,
    fields.email,
    fields.password,
    fields.eula
  );
}

function validate(
  name,
  address,
  dob,
  phone,
  email,
  password,
  confirm_password,
  eula
) {
  // Name
  if (name === "") {
    alert("Name must be filled.");
    return false;
  }
  for (let index = 0; index < name.length; index++) {
    const character = name[index];
    if (!isLetter(character)) {
      alert("Full Name must be letter only.");
      return false;
    }
  }

  // Address
  if (address === "") {
    alert("Address must be filled.");
    return false;
  }

  // Date of birth
  if (dob === "") {
    alert("Date of birth must be filled.");
    return false;
  }
  if (dob.length !== 10) {
    alert("Date of birth must match with yyyy-mm-dd format.");
    return false;
  }
  let accordingToFormat = true;
  for (let index = 0; index < dob.length; index++) {
    const character = dob[index];
    if (index === 4 || index == 7) {
      accordingToFormat = (character === "-");
    } else {
      accordingToFormat = isNumber(character);
    }
  }
  if (!accordingToFormat) {
    alert("Date of birth must match with yyyy-mm-dd format.");
    return false;
  }

  // Phone
  if (phone === "") {
    alert("Phone must be filled.");
    return false;
  }
  for (let index = 0; index < phone.length; index++) {
    const character = phone[index];
    if (!isNumber(character)) {
      alert("Phone must be number only.");
      return false;
    }
  }

  // Email
  if (email === "") {
    alert("Email must be filled.");
    return false;
  }
  if (email.indexOf("@") == -1) {
    alert(`Email must contain "@".`);
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

function addUser(
  name,
  address,
  dob,
  phone,
  email,
  password,
  eula
) {
  db.insert({
    "id": `${email}:${password}`,
    "name": name,
    "address": address,
    "dob": dob,
    "phone": phone,
    "logged_in": true,
    "aggree_to_eula": eula,
    "has_done_tutorial": false,
    "persons": [],
  }, () => {
    window.location.href = getHomeUrl();
  });
}