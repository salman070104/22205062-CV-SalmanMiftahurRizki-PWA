function askNotificationPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('Permission not granted for Notification');
    } else {
      subscribeUserToPush();
    }
  });
}

function subscribeUserToPush() {
  navigator.serviceWorker.ready.then(function(registration) {
    const options = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
    };

    registration.pushManager.subscribe(options)
      .then(function(subscription) {
        console.log('Push Subscription:', JSON.stringify(subscription));
        // Kirim subscription ke server untuk menyimpan
      })
      .catch(function(error) {
        console.error('Push subscription failed:', error);
      });
  });
}

// Fungsi untuk mengubah VAPID key ke format Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}