let db;

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

class DB {
  get(table, id, callback = console.log) {
    let transaction = this.db.transaction([table]);
    let objectStore = transaction.objectStore(table);
    let request = objectStore.get(id);

    request.onerror = event => {
      console.log("Unable to retrieve data from database!");
    };

    request.onsuccess = event => {
      callback(request.result);
    };
  }

  getAll(table, callback = console.log) {
    let objectStore = this.db.transaction(table).objectStore(table);

    objectStore.openCursor().onsuccess = event => {
      let cursor = event.target.result;

      if (cursor) {
        callback({...cursor.value});
        cursor.continue();
      } else {
        console.log(`Getting all rows from table ${table} completed.`);
      }
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
        console.log("Connected to IndexedDB: " + this.db);
      };

      request.onerror = event => {
        console.log("Error connecting to IndexedDB: ");
      };

      request.onupgradeneeded = event => {
        this.db = event.target.result;
        console.log("Upgrading IndexedDB: " + this.db);
        Object.keys(data).forEach(table => {
          this.db.createObjectStore(table, { keyPath: "id" });
        })
      }

    });
  }
}