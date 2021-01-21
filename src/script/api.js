import { getAllMatch, addSavedMatch, deleteSavedMatch } from './event_listener.js';
import { showNotification } from './pwa-register.js';
import { checkSaved } from './db.js';

const BASE_URL = 'https://api.football-data.org/v2';
const API_KEY = 'be743db73dd74b4babb697ade6949cb3';
const OPTION = {
  headers: {
    'X-Auth-Token': API_KEY,
  },
};
const LEAGUE = '2014'; // liga Spanyol / La liga

// register listener from event_listener to window
window.addSavedMatch = addSavedMatch;
window.getAllMatch = getAllMatch;
window.deleteSavedMatch = deleteSavedMatch;
window.showNotification = showNotification;
window.checkSaved = checkSaved
// handle preloader

function finishLoading() {
  const loading = document.getElementById('loading-container');
  loading.style.display = 'none';
}

function error(error) {
  console.log('Error: ' + error);

  const loadFailed = `
    <p class="white-text center-align">
      Gagal memuat data. Periksa koneksi internet lalu coba lagi.
    </p>
  `;

  document.getElementById('progress-bar').className = 'determinate';
  document.getElementById('load-failed').innerHTML = loadFailed;
}

let status = (response) => {
  if (response.status != 200) {
    console.log(`Error : ${response.status}`);
    return Promise.reject(new Error(response.statusText()));
  } else {
    return Promise.resolve(response);
  }
};
// Blok kode untuk melakukan request data json
const getStandings = () => {
  if ('caches' in window) {
    caches
      .match(`${BASE_URL}/competitions/${LEAGUE}/standings?standingType=TOTAL`)
      .then(function (response) {
        if (response) {
          console.log('cache sukses standing');
          response.json().then(function (data) {
            const STANDINGS = data.standings[0].table;
            let standingHTML = '';
            STANDINGS.forEach(function (standing) {
              const LOGO = standing.team.crestUrl.replace(
                /^http:\/\//i,
                'https://'
              );
              standingHTML += `
              <div class="col s12 m6 l4">
                  <div class="card standing">
                    <div class="card-image">
                        <img class="logo" src="${LOGO}" alt="team logo" style="height: 180px;"/>
                    </div>
                    <span class="card-title center">${standing.team.name}</span>
                    <div class="card-content">
                        <div class="standing-info">
                          <div class="standing-info-line">
                            <span>
                            <i class="fas fa-hashtag"></i>
                            Position
                            </span>
                            <span>${standing.position}</span>
                          </div>
                          <div class="standing-info-line">
                            <span>
                            <i class="fas fa-running"></i>
                            Play
                            </span>
                            <span>${standing.playedGames}</span>
                          </div>
                          <div class="standing-info-line">
                            <span>
                            <i class="fas fa-trophy"></i>
                            Won
                            </span>
                            <span>${standing.won}</span>
                          </div>
                          <div class="standing-info-line">
                            <span>
                            <i class="fas fa-window-close"></i>
                            Lost
                            </span>
                            <span>${standing.lost}</span>
                          </div>
                          <div class="standing-info-line">
                            <span>
                            <i class="fas fa-equals"></i>
                            Draw
                            </span>
                            <span>${standing.draw}</span>
                          </div>
                          <div class="standing-info-line">
                            <span>
                            <i class="fas fa-coins"></i>
                            Points
                            </span>
                            <span>${standing.points}</span>
                          </div>
                          <div class="standing-info-line">
                            <span>
                            <i class="far fa-futbol"></i>
                            Goals
                            </span>
                            <span>${standing.goalsFor}</span>
                        </div>
                      </div>
                  </div>
                </div>
              </div>     
            `;
            });
            document.querySelector('#standing').innerHTML = standingHTML;
            finishLoading();
          });
        }
      });
  }

  fetch(`${BASE_URL}/competitions/${LEAGUE}/standings?standingType=TOTAL`,OPTION)
    .then(status)
    .then((response) => response.json())
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      const STANDINGS = data.standings[0].table;
      let standingHTML = '';

      STANDINGS.forEach(function (standing) {
        const LOGO = standing.team.crestUrl.replace(/^http:\/\//i, 'https://');
        standingHTML += `
            <div class="col s12 m6 l4">
                <div class="card standing">
                  <div class="card-image">
                      <img class="logo" src="${LOGO}" alt="team logo" style="height: 180px;"/>
                  </div>
                  <span class="card-title center">${standing.team.name}</span>
                  <div class="card-content">
                      <div class="standing-info">
                        <div class="standing-info-line">
                          <span>
                          <i class="fas fa-hashtag"></i>
                          Position
                          </span>
                          <span>${standing.position}</span>
                        </div>
                        <div class="standing-info-line">
                          <span>
                          <i class="fas fa-running"></i>
                          Play
                          </span>
                          <span>${standing.playedGames}</span>
                        </div>
                        <div class="standing-info-line">
                          <span>
                          <i class="fas fa-trophy"></i>
                          Won
                          </span>
                          <span>${standing.won}</span>
                        </div>
                        <div class="standing-info-line">
                          <span>
                          <i class="fas fa-window-close"></i>
                          Lost
                          </span>
                          <span>${standing.lost}</span>
                        </div>
                        <div class="standing-info-line">
                          <span>
                          <i class="fas fa-equals"></i>
                          Draw
                          </span>
                          <span>${standing.draw}</span>
                        </div>
                        <div class="standing-info-line">
                          <span>
                          <i class="fas fa-coins"></i>
                          Points
                          </span>
                          <span>${standing.points}</span>
                        </div>
                        <div class="standing-info-line">
                          <span>
                          <i class="far fa-futbol"></i>
                          Goals
                          </span>
                          <span>${standing.goalsFor}</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>     
            `;
      });
      document.querySelector('#standing').innerHTML = standingHTML;
      finishLoading();
    });
};

const getUpcomingMatches = () => {
  return new Promise(function (resolve, reject) {
    if ('caches' in window) {
      caches
        .match(`${BASE_URL}/competitions/${LEAGUE}/matches?status=SCHEDULED`)
        .then(function (response) {
          if (response) {
            console.log('sukses cache');
            response.json().then(function (data) {
              const MATCHES = data.matches;
              let matchesHTML = '';

              MATCHES.forEach(function (match) {
                checkSaved(match.id);
                matchesHTML += `
                <div class="col s12 m8 offset-m2 l6">
                  <div class="card match-card">
                    <a class="btn-floating btn-medium orange right add_match">
                      <i onclick="
                      addSavedMatch(${match.id},'${match.homeTeam.name}','${match.awayTeam.name}',
                      '${match.utcDate}'), showNotification(), this.parentElement.style.visibility = 'hidden'" 
                      id="${match.id}" class="large material-icons save">star
                      </i>
                    </a>
                    <div class="card-content">
                      <p class="center team-name">${match.homeTeam.name}</p> 
                      <p class="center versus">VS</p>
                      <p class="center team-name">${match.awayTeam.name}</p>
                      </div>
                      <div class="card-content match-footer">
                        <span>$${match.utcDate.slice(6, 10)}</span>
                        <span>UTC ${match.utcDate.slice(12, 16)} </span>
                      </div>    
                  </div>
                </div>
              `;
              });

              document.querySelector('#match-list').innerHTML = matchesHTML;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(MATCHES);
              finishLoading();
            });
          }
        });
    }
    fetch(`${BASE_URL}/competitions/${LEAGUE}/matches?status=SCHEDULED`, OPTION)
      .then(status)
      .then((response) => response.json())
      .then(function (data) {
        const MATCHES = data.matches;
        let matchesHTML = '';

        MATCHES.forEach(function (match) {
          checkSaved(match.id);
          matchesHTML += `
            <div class="col s12 m8 offset-m2 l6">
              <div class="card match-card">
                <a class="btn-floating btn-medium orange right add_match">
                  <i onclick="
                  addSavedMatch(${match.id},'${match.homeTeam.name}','${match.awayTeam.name}',
                  '${match.utcDate}'), showNotification(), this.parentElement.style.visibility = 'hidden'" 
                  id="${match.id}" class="large material-icons save">star
                  </i>
                </a>
                <div class="card-content">
                  <p class="center team-name">${match.homeTeam.name}</p> 
                  <p class="center versus">VS</p>
                  <p class="center team-name">${match.awayTeam.name}</p>
                  </div>
                  <div class="card-content match-footer">
                    <span>${match.utcDate.slice(6, 10)}</span>
                    <span>UTC ${match.utcDate.slice(12, 16)} </span>
                  </div>
              </div>
            </div>
          `;
        });
        document.querySelector('#match-list').innerHTML = matchesHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(MATCHES);
        finishLoading();
      });
  });
};

export { getStandings, getUpcomingMatches };
