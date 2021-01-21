let dbPromise = idb.open('savedMatches', 1, (upgradeDB) => {
  if (!upgradeDB.objectStoreNames.contains('matches')) {
    upgradeDB.createObjectStore('matches');
  }
});

const saveMatch = ({ id, home, away, date }) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction('matches', 'readwrite');
      let store = tx.objectStore('matches');
      let item = {
        id: id,
        home: home,
        away: away,
        date: date,
      };
      store.put(item, id); //menambahkan key "teams"
      return tx.complete;
    })
    .then(() => M.toast({ html: `Berhasil Menyimpan pertandingan!`, classes: 'rounded' }))
    .catch(() => console.log('Gagal Menyimpan Pertandingan'));
};

const deleteMatch = (id) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction('matches', 'readwrite');
      let store = tx.objectStore('matches');
      store.delete(id);
      return tx.complete;
    })
    .then(() => console.log('Item Deleted'));
};

const getMatch = () => {
  return new Promise(function (resolve, reject) {
    dbPromise
      .then((db) => {
        let tx = db.transaction('matches', 'readonly');
        let store = tx.objectStore('matches');
        return store.getAll();
      })
      .then((data) => {
        resolve(data);
      });
  });
};

const checkSaved = (id) => {
  dbPromise
    .then(function (db) {
      const tx = db.transaction('matches', 'readonly');
      const store = tx.objectStore('matches');
      return store.getAll();
    })
    .then(function (matches) {
      matches.forEach(function (match) {
        if (match.id === id) {
          const saveButton = document.querySelector(`[id="${match.id}"]`);
          // hide save icon if match are already saved
          saveButton.parentElement.style.visibility = 'hidden';
        }
      });
    });
};

export { saveMatch, getMatch, deleteMatch, checkSaved };
