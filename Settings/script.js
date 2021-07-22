function logout() {
  db.getAll(users => {
    if (user.logged_in) {
      user.logged_in = false;
      db.update(user.id, user, () => {
        authCheck();
      });
    } else {
      console.log(`%c You are not logged in to begin with!.`, consoleStyles.fail);
    }
  });
}

function backupData() {
  const filename = `Debook_backup_${(new Date()).toISOString()}.json`;
  const jsonToWrite = JSON.stringify(user.persons);
  const blob = new Blob([jsonToWrite], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove()
}

function restoreData() {
  let file = document.querySelector("input[type=file]");
  if (file.files[0] == undefined) {
    alert(`Please choose your backup data to be restored.`);
    return false;
  }

  let reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(file.files[0]);

  function onReaderLoad(event) {
    let data = JSON.parse(event.target.result);
    user.persons = data;
    db.update(user.id, user, () => {
      alert(`Your data has been successfully restored.`)
    });
  }
}

function seedData() {
  if (confirm("Are you sure? This process involves clearing your data. Make sure to backup your data before seeding to avoid regrets.")) {
    db.getExampleData(seed => {
      user.persons = seed;
      db.update(user.id, user, () => {
        alert("Data has been cleared and filled with example data.")
      });
    });
  }
}

function clearData() {
  if (confirm("Are you sure? Make sure to backup your data before clearing to avoid regrets.")) {
    user.persons = [];
    db.update(user.id, user, () => {
      alert("Data has been cleared.")
    });
  }
}