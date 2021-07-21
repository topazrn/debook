document.addEventListener('DOMContentLoaded', function () {
  renderPersons();
});

function searchPerson() {
  let name = document.querySelector("#search-name").value.toLowerCase();
  let email = document.querySelector("#search-email").value.toLowerCase();
  let phone = document.querySelector("#search-phone").value.toLowerCase();
  let rows = document.querySelectorAll("tbody>tr");
  let matchIndex = [];

  for (let index = 0; index < user.persons.length; index++) {
    const person = user.persons[index];
    if (
      person.name.toLowerCase().indexOf(name) > -1 &&
      person.email.toLowerCase().indexOf(email) > -1 &&
      person.phone.toLowerCase().indexOf(phone) > -1
    ) {
      matchIndex.push(index);
    }
  }

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (matchIndex.indexOf(index) > -1) {
      show(row);
    } else {
      hide(row);
    }
  }
}

function deletePerson(email) {
  for (let index = 0; index < user.persons.length; index++) {
    const person = user.persons[index];
    if (person.email === email) {
      user.persons.splice(index, 1);
      db.update(user.id, user, () => {
        renderPersons();
      });
      break;
    }
  }
}

function addPerson() {
  let name = document.querySelector("#add-name");
  let email = document.querySelector("#add-email");
  let phone = document.querySelector("#add-phone");

  let valid = validate(
    name.value,
    email.value,
    phone.value,
  );

  if (valid) {
    user.persons.push({
      email: email.value,
      phone: phone.value,
      name: name.value,
      debts: [],
    });
    db.update(user.id, user, () => {
      email.value = "";
      phone.value = "";
      name.value = "";
      renderPersons();
    });
  };

  function validate(name, email, phone) {
    // Name
    if (name === "") {
      alert("Name must be filled.");
      return false;
    }
    for (let index = 0; index < name.length; index++) {
      const character = name[index];
      if (!isLetter(character)) {
        alert("Name must be letter only.");
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
    if (!email.endsWith(".com")) {
      alert(`Email must ends with ".com".`);
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

    return true;
  }
}

function renderPersons() {
  show(document.querySelector(".card h4"));
  setTimeout(() => {
    _renderPersons();
    hide(document.querySelector(".card h4"));
  }, 400);
}

function _renderPersons() {
  let personsContainer = document.querySelector(".card.people tbody");
  personsContainer.innerHTML = "";
  let templatePerson = document.querySelectorAll("template")[0].content.querySelector("tr");
  let number = 0;
  user.persons.forEach(person => {
    let cloneTemplatePerson = document.importNode(templatePerson, true);
    let tds = cloneTemplatePerson.querySelectorAll("td");
    let no = tds[0];
    let name = tds[1];
    let email = tds[2];
    let phone = tds[3];
    let deleteButton = tds[4].querySelectorAll("button")[0];
    no.innerText = ++number;
    name.innerText = person.name;
    email.innerText = person.email;
    phone.innerText = person.phone;
    deleteButton.onclick = () => {
      deletePerson(person.email);
    };
    personsContainer.appendChild(cloneTemplatePerson);
  });
}