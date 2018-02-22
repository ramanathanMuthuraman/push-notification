(() => {
  let isUserSubscribed = false;
  const baseRoute = window.location.href.replace(/\/$/, '');
  const baseUrl = `${baseRoute}/api`;
  const apiSettings = {
    getVapidKey: `${baseUrl}/getvapidkey`,
    subscribe: `${baseUrl}/subscribe`,
    unsubscribe: `${baseUrl}/unsubscribe`,
    push: `${baseUrl}/push`
  };
  const getVapidKey = () => {
    fetch(apiSettings.getVapidKey).then((resp) => {
      if (!resp.ok) {
        Promise.reject(new Error('Error'));
      }
      resp.json().then(function (json) {
        sessionStorage.setItem('vapidKey', JSON.stringify(json.key));
      });
    }).catch(() => {
      console.log('error while fetching vapid key')
    });
  };
  const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  const getVapidKeyFromSession = () => {
    return sessionStorage.getItem('vapidKey');
  };
  const onSubscription = () => {
    updateNotificationButton(true);
    isUserSubscribed = true;
  };

  const onUnSubscription = () => {
    updateNotificationButton(false);
    isUserSubscribed = false;
  };
  const saveSubscription = (subscription) => {
    fetch(apiSettings.subscribe, {
      method: 'POST',
      body: JSON.stringify({
        subscription: subscription
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((resp) => {
      if (resp.ok) {
        onSubscription();
        console.log('%c Subscription saved to server', 'color: #00ffff');
      }
    })
      .catch((err) => {
        console.log('Error on subscription', err);
      });
  };
  const removeSubscription = (subscription) => {
    fetch(apiSettings.unsubscribe, {
      method: 'POST',
      body: JSON.stringify({
        subscription: subscription
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((resp) => {
      if (resp.ok) {
        console.log('%c Subscription removed from server', 'color: #00ffff');
      }
    })
      .catch((err) => {
        console.log('Error on removing subscription from server', err);
      });
  };
  const errorInSubscription = (err) => {
    if (Notification.permission === 'denied') {
      console.warn('Permission for notifications was denied');
    } else {
      console.error('Failed to subscribe the user: ', err);
    }
  };
  const subscribeUser = (reg) => {
    const vapidKey = getVapidKeyFromSession();
    if (!vapidKey) {
      console.log('No vapid key available');
      return false;
    }
    const key = JSON.parse(vapidKey);
    const vapidKeyBuffer = urlB64ToUint8Array(key);

    reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKeyBuffer
    }).then(saveSubscription)
      .catch(errorInSubscription);
  };
  const UnSubscribeUser = (reg) => {
    reg.pushManager.getSubscription().then((subscription) => {
      subscription.unsubscribe().then(() => {
        onUnSubscription();
        removeSubscription(subscription);
        console.log('%c Push notification unsubscription successful', 'color: #ff0000');
      }).catch(function () {
        console.warn('Unsubscription failed');
      })
    });
  };
  const notifyAction = () => {
    navigator.serviceWorker.ready.then((reg) => {
      if (!isUserSubscribed) {
        subscribeUser(reg);
      } else {
        UnSubscribeUser(reg);
      }
    });
  };
  const updateNotificationButton = (isSubscribed) => {
    if (isSubscribed) {
      document.getElementById('notification').classList.remove('icon-notifications');
      document.getElementById('notification').classList.add('icon-notifications_active');
    } else {
      document.getElementById('notification').classList.remove('icon-notifications_active');
      document.getElementById('notification').classList.add('icon-notifications_off');
    }
  };
  const getUserSubscription = () => {
    return navigator.serviceWorker.ready.then(reg => {
      return reg.pushManager.getSubscription()
        .then(subscription => {
          if (!!subscription) {
            onSubscription();
          }
        });
    });
  };
  const validateMessage = (e) => {
    document.getElementById('action').disabled = !e.target.value.length;
  };
  const sendPushMessage = () => {
    const message = document.getElementById('message').value;
    fetch(`${apiSettings.push}?message=${message}`).then(() => {
      console.log(`Message posted successfully`);
    }).catch((error) => {
      console.log(`Error on posting message ${error}`);
    })
  };
  document.getElementById('notification').addEventListener('click', notifyAction);
  document.getElementById('message').addEventListener('keyup', validateMessage);
  document.getElementById('action').addEventListener('click', sendPushMessage);
  getVapidKey();
  getUserSubscription();
})();
