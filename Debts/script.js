let debtsDuplicate = [];

whenDbIsReady = () => {
  generateDebtsDuplicate()
  sortByName(document.getElementById("sort-name"));
};

function generateDebtsDuplicate() {
  debtsDuplicate = [];
  for (let personIndex = 0; personIndex < user.persons.length; personIndex++) {
    const person = user.persons[personIndex];
    for (let debtIndex = 0; debtIndex < person.debts.length; debtIndex++) {
      const debt = person.debts[debtIndex];
      debtsDuplicate.push({
        id: `${personIndex}-${debtIndex}`,
        name: person.name,
        description: debt.description,
        date: new Date(debt.date),
        amount: debt.amount,
      });
    }
  }
}

let sortByNameAscending = false;
let sortByDescriptionAscending = false;
let sortByDateAscending = false;
let sortByAmountAscending = false;

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
  debtsDuplicate.sort((a, b) => {
    return (sortByNameAscending ? 1 : -1) * (a.name).localeCompare((b.name), 'en', { sensitivity: 'base' });
  });

  renderDebts();
}

function sortByDescription(th) {
  clearAllSorts();

  th.classList.add("sorted");
  sortByDescriptionAscending = !sortByDescriptionAscending;
  th.innerText = (sortByDescriptionAscending ? "⇑" : "⇓") + " " + th.getAttribute("data-original-text");
  debtsDuplicate.sort((a, b) => {
    return (sortByDescriptionAscending ? 1 : -1) * (a.description).localeCompare((b.description), 'en', { sensitivity: 'base' });
  });

  renderDebts();
}

function sortByDate(th) {
  clearAllSorts();

  th.classList.add("sorted");
  sortByDateAscending = !sortByDateAscending;
  th.innerText = (sortByDateAscending ? "⇑" : "⇓") + " " + th.getAttribute("data-original-text");
  debtsDuplicate.sort((a, b) => {
    return (sortByDateAscending ? 1 : -1) * (a.date > b.date ? 1 : -1);
  });

  renderDebts();
}

function sortByAmount(th) {
  clearAllSorts();

  th.classList.add("sorted");
  sortByAmountAscending = !sortByAmountAscending;
  th.innerText = (sortByAmountAscending ? "⇑" : "⇓") + " " + th.getAttribute("data-original-text");
  debtsDuplicate.sort((a, b) => {
    return (sortByAmountAscending ? 1 : -1) * (a.amount > b.amount ? 1 : -1);
  });

  renderDebts();
}

function fillPeopleDatalist() {
  let datalist = document.querySelector("#datalist-add-email");
  user.persons.forEach(person => {
    let option = document.createElement("option");
    option.value = person.email;
    option.innerText = person.name;
    datalist.appendChild(option);
  });
}

function searchDebt() {
  let name = document.querySelector("#search-name").value.toLowerCase();
  let description = document.querySelector("#search-description").value.toLowerCase();
  let date = document.querySelector("#search-date").value;
  let rows = document.querySelectorAll("tbody>tr");
  let matchIds = [];

  for (let personIndex = 0; personIndex < user.persons.length; personIndex++) {
    const person = user.persons[personIndex];
    let nameMatches = (person.name.toLowerCase().indexOf(name) > -1);
    for (let debtIndex = 0; debtIndex < person.debts.length; debtIndex++) {
      const debt = person.debts[debtIndex];
      if (
        nameMatches &&
        debt.description.toLowerCase().indexOf(description) > -1 &&
        (debt.date === date || date === "")
      ) {
        matchIds.push(`${personIndex}-${debtIndex}`);
      }
    }
  }

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (matchIds.indexOf(row.getAttribute("data-id")) > -1) {
      show(row);
    } else {
      hide(row);
    }
  }
}

function deleteDebt(deleteButton) {
  const indexes = deleteButton.closest("tr").getAttribute("data-id").split("-");
  const personIndex = indexes[0];
  const debtIndex = indexes[1];
  user.persons[personIndex].debts.splice(debtIndex, 1);
  db.update(user.id, user, () => {
    generateDebtsDuplicate();
    renderDebts();
  });
}

function addDebt() {
  let email = document.querySelector("#add-email");
  let description = document.querySelector("#add-description");
  let date = document.querySelector("#add-date");
  let amount = document.querySelector("#add-amount");

  let valid = validate(
    email.value,
    description.value,
    date.value,
    amount.value,
  );

  if (valid) {
    for (let index = 0; index < user.persons.length; index++) {
      const person = user.persons[index];
      if (person.email == email.value) {
        person.debts.push({
          "description": description.value,
          "date": date.value,
          "amount": parseInt(amount.value),
        });
        break;
      }
    }
    db.update(user.id, user, () => {
      email.value = "";
      description.value = "";
      date.value = "";
      amount.value = "";
      generateDebtsDuplicate();
      renderDebts();
    });
  };

  function validate(email, description, date, amount) {
    // Email
    if (email === "") {
      alert("Email must be filled.");
      return false;
    }
    if (email.indexOf("@") == -1) {
      alert(`Email must contain "@".`);
      return false;
    }
    let emailExists = false;
    for (let index = 0; index < user.persons.length; index++) {
      const person = user.persons[index];
      if (person.email == email) {
        emailExists = true;
        break;
      }
    }
    if (!emailExists) {
      alert(`Person with email ${email} does not exists.`);
      return false;
    }

    // Description
    if (description === "") {
      alert("Description must be filled.");
      return false;
    }

    // Date
    if (date === "") {
      alert("Date must be filled.");
      return false;
    }
    if (date.length !== 10) {
      console.log(date.length);
      alert("Date must match with yyyy-mm-dd format.");
      return false;
    }
    let accordingToFormat = true;
    for (let index = 0; index < date.length; index++) {
      const character = date[index];
      if (index === 4 || index == 7) {
        accordingToFormat = (character === "-");
      } else {
        accordingToFormat = isNumber(character);
      }
    }
    if (!accordingToFormat) {
      alert("Date must match with yyyy-mm-dd format.");
      return false;
    }

    // Amount
    if (amount === "") {
      alert("Amount must be filled.");
      return false;
    }
    for (let index = 0; index < amount.length; index++) {
      const character = amount[index];
      if (index === 0 && character === "-") {
        continue;
      }
      if (!isNumber(character)) {
        alert("Amount must be number only.");
        return false;
      }
    }

    return true;
  }
}

function renderDebts() {
  let debtsContainer = document.querySelector(".card.debts tbody");
  debtsContainer.innerHTML = "";
  let templateDebt = document.querySelectorAll("template")[0].content.querySelector("tr");
  for (let index = 0; index < debtsDuplicate.length; index++) {
    const debt = debtsDuplicate[index];
    let cloneTemplateDebt = document.importNode(templateDebt, true);
    let tds = cloneTemplateDebt.querySelectorAll("td");
    let no = tds[0];
    let name = tds[1];
    let description = tds[2];
    let date = tds[3];
    let amount = tds[4];
    no.innerText = (index + 1);
    cloneTemplateDebt.setAttribute("data-id", debt.id);
    name.innerText = debt.name;
    description.innerText = debt.description;
    date.innerText = debt.date.toLocaleDateString("ID-id");
    amount.innerText = toRupiah(debt.amount);
    debtsContainer.appendChild(cloneTemplateDebt);
  }
}