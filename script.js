whenDbIsReady = () => {
  renderSummary();
  renderHistory();
};

function renderSummary() {
  const amountText = document.querySelectorAll(".progress-title");
  const amountTextOfOthers = amountText[0];
  const amountTextOfYours = amountText[1];
  const amountTextOfBalance = amountText[2];

  const percentageText = document.querySelectorAll(".progress-percentage");
  const percentageTextOfOthers = percentageText[0];
  const percentageTextOfYours = percentageText[1];
  const percentageTextOfBalance = percentageText[2];

  const percentageBar = document.querySelectorAll(".progress");
  const percentageBarOfOthers = percentageBar[0];
  const percentageBarOfYours = percentageBar[1];
  const percentageBarOfBalance = percentageBar[2];

  let amountOfOthers = 0;
  let amountOfYours = 0;
  user.persons.forEach(person => {
    person.debts.forEach(debt => {
      if (debt.amount > 0) {
        amountOfOthers += debt.amount;
      } else {
        amountOfYours += Math.abs(debt.amount);
      }
    });
  });
  const amountOfBalance = amountOfOthers - amountOfYours;

  amountTextOfOthers.innerText += " " + toRupiah(amountOfOthers); 
  amountTextOfYours.innerText += " " + toRupiah(amountOfYours);
  amountTextOfBalance.innerText += " " + toRupiah(amountOfBalance);

  const percentageOfOthers = `${Math.round((amountOfOthers / (amountOfOthers + amountOfYours)) * 100)}%`;
  const percentageOfYours = `${Math.round((amountOfYours / (amountOfOthers + amountOfYours)) * 100)}%`;
  const percentageOfBalance = `${Math.round((amountOfBalance / (amountOfOthers + amountOfYours)) * 100)}%`;

  percentageTextOfOthers.innerText = percentageOfOthers;
  percentageTextOfYours.innerText = percentageOfYours;
  percentageTextOfBalance.innerText = percentageOfBalance;
  
  percentageBarOfOthers.style.width = percentageOfOthers;
  percentageBarOfYours.style.width = percentageOfYours;
  percentageBarOfBalance.style.width = percentageOfBalance;
}

function renderHistory() {
  let debtsContainer = document.querySelector(".card.debts tbody");
  debtsContainer.innerHTML = "";
  let templateDebt = document.querySelectorAll("template")[0].content.querySelector("tr");
  let debts = [];
  for (let personIndex = 0; personIndex < user.persons.length; personIndex++) {
    const person = user.persons[personIndex];
    for (let debtIndex = 0; debtIndex < person.debts.length; debtIndex++) {
      const debt = person.debts[debtIndex];
      debts.push({
        name: person.name,
        description: debt.description,
        date: new Date(debt.date),
        amount: debt.amount,
      })
    }
  }
  debts.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    }
    if (b.date > a.date) {
      return 1;
    }
    return 0;
  });
  let number = 0;
  for (let index = 0; index < debts.length && index < 10; index++) {
    const debt = debts[index];
    let cloneTemplateDebt = document.importNode(templateDebt, true);
    let tds = cloneTemplateDebt.querySelectorAll("td");
    let no = tds[0];
    let name = tds[1];
    let description = tds[2];
    let date = tds[3];
    let amount = tds[4];
    no.innerText = ++number;
    name.innerText = debt.name;
    description.innerText = debt.description;
    date.innerText = debt.date.toLocaleDateString("ID-id");
    amount.innerText = toRupiah(debt.amount);
    debtsContainer.appendChild(cloneTemplateDebt);
  }
}