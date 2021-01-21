import { saveMatch, getMatch, deleteMatch } from './db.js';

const addSavedMatch = (id, home, away, date) => {
  //Add To Database
  saveMatch({ id, home, away, date });
  //Display Toast
  console.log('berhasil menambahkan match');
};

// get all match from db
const getAllMatch = () => {
  //Get All saved match From Database
  getMatch().then((data) => {
    let matchHTML = '';
    // menampilkan teks kosong jika belum ada saved match
    if (data == 0) {
      matchHTML += `
      <p class="flow-text red-text">Belum ada pertandingan yang disimpan.</p>
      `;
      document.querySelector('#saved-matches').innerHTML = matchHTML;
    } else {
      data.forEach((match) => {
        matchHTML += `
          <div class="col s12 m6">
            <div class="card match-card">
              <div class="card-content">
                <p class="center team-name">${match.home}</p> 
                <p class="center versus">VS</p>
                <p class="center team-name">${match.away}</p>
                </div>
                <div class="card-content match-footer">
                  <span>${match.date.slice(6, 10)}</span>
                  <span>UTC ${match.date.slice(12, 16)} </span>
                  <a class="btn-floating btn-medium red delete_match">
                  <i onclick="deleteSavedMatch(${match.id},'${
          match.date
        }')" class="large material-icons save">delete</i>
                  </a>
                </div>
            </div>
          </div>
        `;
      });
      document.querySelector('#saved-matches').innerHTML = matchHTML;
    }
  });
};

const deleteSavedMatch = (id, date) => {
  //Confirm Delete Bookmark ?
  let confirmation = confirm(
    `Apakah Anda Yakin ingin menghapus pertandingan pada tanggal ${date.slice(0, 10)} dari daftar tontonan?`
  );
  if (confirmation) {
    //Delete Team From Database
    deleteMatch(id);
    //Fetch All Team
    getAllMatch();
    //Display Toast
    M.toast({ html: `Berhasil Menghapus pertandingan!`, classes: 'rounded' });
  }
};

export { getAllMatch, addSavedMatch, deleteSavedMatch };
