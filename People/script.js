document.addEventListener('DOMContentLoaded', function () {
    renderPersons();
});

function deletePerson(email) {
  for (let index = 0; index < user.persons.length; index++) {
    const person = user.persons[index];
    if (person.email === email) {
      user.persons.splice(index, 1);
      db.update("users", user.id, user, () => {
        renderPersons();
      });
      break;
    }
  }
}

function addPerson() {
  let name = document.querySelector("#add-name").value;
  let email = document.querySelector("#add-email").value;
  let phone = document.querySelector("#add-phone").value;

  let valid = validate();

  if (valid) {
    user.persons.push({
      email,
      phone,
      name,
      debts: [],
    });
    db.update("users", user.id, user, () => {
      renderPersons();
    });
  };

  function validate() {
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
  }, 1000);
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