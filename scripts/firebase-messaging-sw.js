importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');
// Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAzby1MLn75SBPBdD2aPvJvmvvfIjgvr0Y",
        authDomain: "chat-86dc3.firebaseapp.com",
       databaseURL: "https://chat-86dc3.firebaseio.com",
        projectId: "chat-86dc3",
       storageBucket: "chat-86dc3.appspot.com",
       messagingSenderId: "612135243639",
       appId: "1:612135243639:web:73c534095f927908cb1b72",
       measurementId: "G-8SB9HTCQ3L"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BLmr_FVY8kFvdgvkXCE2xngWFDA9TNNoly2MbJJhG1q4wzPo1_Y5wh1UTtUysX8KFbl9KLbk_n0sBHDER9xzDBY");
messaging.onBackgroundMessage(function(payload) {
const notificationTitle = payload.data.title;
const notificationOptions = {
body: payload.data.message,
icon:'./images/icon.jpg',
data: { url:payload.data.onClick }, //the url which we gonna use later
};
return self.registration.showNotification(notificationTitle,notificationOptions);
});
//Code for adding event on click of notification
self.addEventListener('notificationclick', function(event) {
let url = event.notification.data.url;
event.notification.close(); 
event.waitUntil(
clients.matchAll({type: 'window'}).then( windowClients => {
// Check if there is already a window/tab open with the target URL
for (var i = 0; i < windowClients.length; i++) {
var client = windowClients[i];
// If so, just focus it.
if (client.url === url && 'focus' in client) {
return client.focus();
}
}
// If not, then open the target URL in a new window/tab.
if (clients.openWindow) {
return clients.openWindow(url);
}
})
);
});