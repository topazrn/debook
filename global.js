let db;
let consoleStyles = {
  success: "background-color: green; color: white",
  fail: "background-color: red; color: white",
};

document.addEventListener('DOMContentLoaded', function () {
  db = new DB();
});

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
  db.getAll("users", users => {
    let logged_in = false;
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      if (user.logged_in) {
        logged_in = true;
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
  db.getAll("users", users => {
    let logged_in = false;
    let user;
    for (let index = 0; index < users.length; index++) {
      user = users[index];
      if (user.logged_in) {
        logged_in = true;
        break;
      }
    }
    if (logged_in) {
      user.logged_in = false;
      db.update("users", user.id, user, () => {
        authCheck();
      });
    } else {
      console.log(`%c You are not logged in to begin with!.`, consoleStyles.fail);
    }
  });
}

class DB {
  get(table, id, callback = console.log) {
    let transaction = this.db.transaction([table]);
    let objectStore = transaction.objectStore(table);
    let request = objectStore.get(id);

    request.onerror = event => {
      console.log("%c Unable to retrieve data from database!", consoleStyles.fail);
    };

    request.onsuccess = event => {
      callback(request.result);
    };
  }

  getAll(table, callback = console.log) {
    let data = [];
    let objectStore = this.db.transaction(table).objectStore(table);
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

  insert(table, data, callback) {
    let request = this.db.transaction([table], "readwrite")
      .objectStore(table)
      .add(data)

    request.onsuccess = event => {
      console.log(`%c Insert data to table ${table} successful.`, consoleStyles.success);
      callback()
    };

    request.onerror = event => {
      console.log(`%c Insert data to table ${table} unsuccessful.`, consoleStyles.fail);
    }
  }

  update(table, id, data, callback) {
    this.delete(table, id, () => {
      this.insert(table, data, callback);
    });
  }

  delete(table, id, callback) {
    let request = this.db.transaction([table], "readwrite")
      .objectStore(table)
      .delete(id);

    request.onsuccess = event => {
      console.log(`%c Delete data from table ${table} successful.`, consoleStyles.success);
      callback();
    };
  }

  import(data) {
    Object.keys(data).forEach(table => {
      data[table].forEach(row => {
        this.db.transaction([table], "readwrite")
          .objectStore(table)
          .add(row)
      });
    })
  }

  getExampleData(callback) {
    fetch(`${getHomeUrl()}/assets/DB-example.json`)
      .then(response => response.json())
      .then(data => callback(data));
  }

  constructor() {
    this.getExampleData((data) => {
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
        Object.keys(data).forEach(table => {
          this.db.createObjectStore(table, { keyPath: "id" });
        })
      }

    });
  }
}