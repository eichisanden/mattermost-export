let express = require('express');
let router = express.Router();
let client = require('../mattermost-client');

let thisRes;
router.post('/', function(req, res, next) {
  thisRes = res;
  client.logout(success, error);
});

let success = (resbody, res) => {
  thisRes.render('index', { title: 'Top' });
};

let error = (e, err, res) => {
  console.log("error")
  console.log(e);
  console.log(err);
};

module.exports = router;
