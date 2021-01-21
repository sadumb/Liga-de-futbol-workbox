import { getStandings, getUpcomingMatches } from './api.js';
import { getAllMatch } from './event_listener.js';

function loadNav() {
  let elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status != 200) return;

      // Muat daftar tautan menu
      document.querySelectorAll('.topnav, .sidenav, #nav-logo').forEach(function (elm) {
        elm.innerHTML = xhttp.responseText;
      });

      // Daftarkan event listener untuk setiap tautan menu
      document.querySelectorAll('.sidenav a, .topnav a, #nav-logo').forEach(function (elm) {
        elm.addEventListener('click', function (event) {
          // Tutup sidenav
          let sidenav = document.querySelector('.sidenav');
          M.Sidenav.getInstance(sidenav).close();

          // Muat konten halaman yang dipanggil
          let page = event.target.getAttribute('href').substr(1);
          loadPage(page);
        });
      });
    }
  };
  xhttp.open('GET', 'nav.html', true);
  xhttp.send();
}

function loadPage(page) {
  if (page == '') page = 'home';

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      let content = document.querySelector('.body-content');
      let home_content = document.querySelector('.home-content');
      if (this.status == 200) {
        content.innerHTML = xhttp.responseText;

        // fungsi untuk memindahkan taget render dari body-content ke home_content
        const loadHomeContent = () => {
          home_content.innerHTML = content.innerHTML;
        };
        // fungsi untuk memberhentikan loading content yg diinginkan
        const dontLoadContent = (content_section) => {
          content_section.innerHTML = '';
        };

        if (page === 'home') {
          loadHomeContent();
          // mengosongkan konten supaya tidak terload
          dontLoadContent(content);
        } else if (page === 'standing') {
          dontLoadContent(home_content);
          getStandings();
        } else if (page === 'match') {
          dontLoadContent(home_content);
          getUpcomingMatches();
        } else if (page === 'saved') {
          dontLoadContent(home_content);
          getAllMatch();
        }
      } else if (this.status == 404) {
        content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
      } else {
        content.innerHTML = '<p>Ups.. halaman tidak dapat diakses.</p>';
      }
    }
  };
  xhttp.open('GET', `src/pages/${page}.html`, true);
  xhttp.send();
}

export { loadNav, loadPage };
