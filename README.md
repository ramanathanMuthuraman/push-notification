# push-notification
Push notifications let your app extend beyond the browser, and are an incredibly powerful way to engage with the user.
They can do simple things, such as alert the user to an important event, display an icon and a small piece of
text that the user can then click to open up your site.

## Install dependencies

```
npm install
```

## Start application
```
npm start
```

## About application
    1. Click on the subscription icon to receive push notifications from server
    2. To trigger a push notification
        * Open a new tab
        * In the address bar enter {app_url}/api/push?message={text} and load
        * For instance if application is running in http://localhost:4567 the URL to load should be http://localhost:4567/api/push?message=Hi
    3. Clicking again will unsubscribe from push notifications
    
## Demo
For demo.. click [here](https://push-notification-jwssnkvfvg.now.sh/)
