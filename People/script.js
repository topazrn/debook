whenDbIsReady = () => {
  sortByName(document.getElementById("sort-name"));
  renderPersons();
}

let sortByNameAscending = false;
let sortByEmailAscending = false;
let sortByPhoneAscending = false;

function clearAllSorts() {
  const sortables = document.querySelectorAll(".sortable");
  sortables.forEach(sortable => {
    sortable.classList.remove("sorted");
    sortable.innerText = sortable.getAttribute("data-original-text");
  });
}

function sortByName(th) {
  clearAllSorts();

  th.classList.add("sorted");
  sortByNameAscending = !sortByNameAscending;
  th.innerText = (sortByNameAscending ? "⇑" : "⇓") + " " + th.getAttribute("data-original-text");
  user.persons.sort((a, b) => {
    return (sortByNameAscending ? 1 : -1) * (a.name).localeCompare((b.name), 'en', { sensitivity: 'base' });
  });

  renderPersons();
}

function sortByEmail(th) {
  clearAllSorts();

  th.classList.add("sorted");
  sortByEmailAscending = !sortByEmailAscending;
  th.innerText = (sortByEmailAscending ? "⇑" : "⇓") + " " + th.getAttribute("data-original-text");
  user.persons.sort((a, b) => {
    return (sortByEmailAscending ? 1 : -1) * (a.email).localeCompare((b.email), 'en', { sensitivity: 'base' });
  });

  renderPersons();
}

function sortByPhone(th) {
  clearAllSorts();

  th.classList.add("sorted");
  sortByPhoneAscending = !sortByPhoneAscending;
  th.innerText = (sortByPhoneAscending ? "⇑" : "⇓") + " " + th.getAttribute("data-original-text");
  user.persons.sort((a, b) => {
    return (sortByPhoneAscending ? 1 : -1) * (a.phone).localeCompare((b.phone), 'en', { sensitivity: 'base' });
  });

  renderPersons();
}

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

function deletePerson(deleteButton) {
  let personIndex = parseInt(deleteButton.closest("tr").getAttribute("data-id"));
  user.persons.splice(personIndex, 1);
  db.update(user.id, user, () => {
    renderPersons();
  });
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
  let personsContainer = document.querySelector(".card.people tbody");
  personsContainer.innerHTML = "";
  let templatePerson = document.querySelectorAll("template")[0].content.querySelector("tr");
  for (let index = 0; index < user.persons.length; index++) {
    const person = user.persons[index];
    let cloneTemplatePerson = document.importNode(templatePerson, true);
    let tds = cloneTemplatePerson.querySelectorAll("td");
    let no = tds[0];
    let name = tds[1];
    let email = tds[2];
    let phone = tds[3];
    cloneTemplatePerson.setAttribute("data-id", index);
    no.innerText = (index + 1);
    name.innerText = person.name;
    email.innerText = person.email;
    phone.innerText = person.phone;
    personsContainer.appendChild(cloneTemplatePerson);
  }
}