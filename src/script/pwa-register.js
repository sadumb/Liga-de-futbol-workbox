// REGISTER SERVICE WORKER
const swRegister = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(function () {
          console.log('Pendaftaran ServiceWorker berhasil');
        })
        .catch(function () {
          console.log('Pendaftaran ServiceWorker gagal');
        });
    });
  } else {
    console.log('ServiceWorker belum didukung browser ini.');
  }
};

// Periksa fitur Notification API
const notifyRegister = () => {
  if ('Notification' in window) {
    requestPermission();
  } else {
    console.error('Browser tidak mendukung notifikasi.');
  }
};

// Meminta ijin menggunakan Notification API
const requestPermission = () => {
  Notification.requestPermission().then(function (result) {
    if (result === 'denied') {
      console.log('Fitur notifikasi tidak diijinkan.');
      return;
    } else if (result === 'default') {
      console.error('Pengguna menutup kotak dialog permintaan ijin.');
      return;
    }

    if ('PushManager' in window) {
      // private key : "QO0-aj023b8-gEny56DxAFjP99I4PW8Z5MFZGLVFTPc"
      const PUBLIC_KEY = 'BMrhZ2Qi1dok_3q87Th3Ly89IMCz8IM0DJvShRmZWjxroc9WzIaeARHdYy4KCVBCinKbmEP0X1xVMgHwR4enKiI';
      navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.getRegistration().then(function (registration) {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
            })
            .then(function (subscribe) {
              console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
              console.log(
                'Berhasil melakukan subscribe dengan p256dh key: ',
                btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh'))))
              );
              console.log(
                'Berhasil melakukan subscribe dengan auth key: ',
                btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))))
              );
            })
            .catch(function (e) {
              console.error('Tidak dapat melakukan subscribe ', e.message);
            });
        });
      });
    }
  });
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const showNotification = () => {
  const title = 'Success!';
  const options = {
    body: 'Berhasil menambahkan pertandingan!',
    icon: '/src/assets/logo/logo.png',
  };
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.showNotification(title, options);
    });
  } else {
    console.error('Fitur notifikasi tidak diijinkan.');
  }
};

export { swRegister, notifyRegister, requestPermission, showNotification };
