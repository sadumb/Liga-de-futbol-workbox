import { loadNav, loadPage } from './nav.js';
import { swRegister, notifyRegister } from './pwa-register.js';

let page = window.location.hash.substr(1);
if (page == '') page = 'home';

// register sw and notification API

swRegister();
notifyRegister();

document.addEventListener('DOMContentLoaded', function () {
  // SIDEBAR NAVIGATION
  loadNav();
  // Load page content
  loadPage(page);
});
