let db;
let user;

let consoleStyles = {
  success: "background-color: green; color: white",
  fail: "background-color: red; color: white",
};

document.addEventListener('DOMContentLoaded', function () {
  db = new DB();
});

function hide(elem) {
  elem.style.display = 'none';
}

function show(elem) {
  elem.style.display = '';
}

function toRupiah(_int) {
  _int = parseInt(_int);
  let options = {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  return _int.toLocaleString('id-ID', options);
}

function getHomeUrl() {
  return `${window.location.protocol}//${window.location.host}`;
}

function getCurrentUrlWithoutQueryString() {
  return `${getHomeUrl()}${window.location.pathname}`;
}

function authCheck() {
  db.getAll(users => {
    let logged_in = false;
    for (let index = 0; index < users.length; index++) {
      user = users[index];
      if (user.logged_in) {
        logged_in = true;
        whenDbIsReady();
        break;
      }
    }
    if (logged_in) {
      if (!requiresLogin()) window.location.href = getHomeUrl();

    } else {
      if (requiresLogin()) window.location.href = getHomeUrl() + "/Login/index.html";
    }
  });

  function requiresLogin() {
    const pagesThatDoesNotRequireLogin = [
      "register",
      "login",
    ];

    let requiresLogin = true;
    for (let index = 0; index < pagesThatDoesNotRequireLogin.length; index++) {
      const page = pagesThatDoesNotRequireLogin[index];
      requiresLogin = !getCurrentUrlWithoutQueryString().toLowerCase().startsWith(getHomeUrl() + "/" + page)
      if (!requiresLogin) break;
    }
    return requiresLogin;
  }
}

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

class DB {
  get(id, callback = console.log) {
    let transaction = this.db.transaction([this.table]);
    let objectStore = transaction.objectStore(this.table);
    let request = objectStore.get(id);

    request.onerror = event => {
      console.log("%c Unable to retrieve data from database!", consoleStyles.fail);
    };

    request.onsuccess = event => {
      callback(request.result);
    };
  }

  getAll(callback = console.log) {
    let data = [];
    let objectStore = this.db.transaction(this.table).objectStore(this.table);
    objectStore.openCursor().onsuccess = event => {
      let cursor = event.target.result;
      if (cursor) {
        data.push({ ...cursor.value });
        cursor.continue();
      } else {
        callback(data);
      }
    };
  }

  insert(data, callback) {
    let request = this.db.transaction([this.table], "readwrite")
      .objectStore(this.table)
      .add(data)

    request.onsuccess = event => {
      console.log(`%c Insert data to table ${this.table} successful.`, consoleStyles.success);
      callback()
    };

    request.onerror = event => {
      console.log(`%c Insert data to table ${this.table} unsuccessful.`, consoleStyles.fail);
    }
  }

  update(id, data, callback) {
    this.delete(id, () => {
      this.insert(data, callback);
    });
  }

  delete(id, callback) {
    let request = this.db.transaction([this.table], "readwrite")
      .objectStore(this.table)
      .delete(id);

    request.onsuccess = event => {
      console.log(`%c Delete data from table ${this.table} successful.`, consoleStyles.success);
      callback();
    };
  }

  import(data) {
    data.forEach(row => {
      this.db.transaction([this.table], "readwrite")
        .objectStore(this.table)
        .add(row)
    });
  }

  getExampleData(callback) {
    fetch(`${getHomeUrl()}/assets/DB-example.json`)
      .then(response => response.json())
      .then(data => callback(data));
  }

  constructor() {
    this.table = "users";
    let request = window.indexedDB.open("mydb", 1);

    request.onsuccess = event => {
      this.db = request.result;
      console.log("%c Connected to IndexedDB: " + this.db, consoleStyles.success);
      authCheck();
    };

    request.onerror = event => {
      console.log("%c Error connecting to IndexedDB: ", consoleStyles.fail);
    };

    request.onupgradeneeded = event => {
      this.db = event.target.result;
      console.log("%c Upgrading IndexedDB: " + this.db, consoleStyles.success);
      this.db.createObjectStore(this.table, { keyPath: "id" });
    }
  }
}

let whenDbIsReady = () => {
  // empty function
};