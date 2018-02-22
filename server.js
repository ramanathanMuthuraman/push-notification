const express = require('express');
const bodyParser = require('body-parser');
const pushUtil = require('./push');

pushUtil.init();

const publicKey = pushUtil.getPublicVapidKey();

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/api/getvapidkey', (req, res) => {
  res.json({
    key: publicKey
  });
});

app.post('/api/subscribe', (req, res) => {
  pushUtil.addSubscription(req.body.subscription);
  res.json({
    success: true,
    message: 'Subscribed'
  });
});

app.post('/api/unsubscribe', (req, res) => {
  pushUtil.removeSubscription(req.body.subscription);
  res.json({
    success: true,
    message: 'Subscribed'
  });
});


app.get('/api/push', (req, res) => {
  res.json({
    success: true,
    message: 'Push successful'
  });
  const pushMsg = {
    message: req.query.message || 'Default Message'
  };
  pushUtil.sendNotification(JSON.stringify(pushMsg));
});

const port = process.env.PORT || 4567;

app.listen(port, () => {
  console.log('running on ' + port);
});