let webPush = require('web-push');
const vapidKeys = {
   "publicKey": "BMrhZ2Qi1dok_3q87Th3Ly89IMCz8IM0DJvShRmZWjxroc9WzIaeARHdYy4KCVBCinKbmEP0X1xVMgHwR4enKiI",
   "privateKey": "QO0-aj023b8-gEny56DxAFjP99I4PW8Z5MFZGLVFTPc"
};
 
webPush.setVapidDetails(
   'mailto:sadumb7@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
let pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fuX3dyrelX0:APA91bHkQ5edMXF2GjoxlV8Rn6htRPB_g3uZaV9H4axAaTv6zOYsEG3ta9IHi4_fmYQbZU_RHtnltE5kqFXNCa0Mxny9rEgPHAT9O2PQ1CGyaVIVBLk1BDACOyGx1IiiP24OMLvEIuz-",
   "keys": {
       "p256dh": "BBSklJZT/1HA0CpEJ4t5LLgGVHM43/KrYt+vUCYn+pjrQ/Vg2hbxDxqLRJNxlS64n6EWwqniy572wxEnFJhakVE=",
       "auth": "iihtg3a1/lEyjG0HXxGZxw=="
   }
};
let payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
let options = {
   gcmAPIKey: '385799175972',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);