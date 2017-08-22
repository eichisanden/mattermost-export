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
  console.log("===============================")
  console.log("Error")
  console.log("===============================")
  console.log(`status_code:${e.status_code}`);
  console.log(`detailed_error:${e.detailed_error}`);
  console.log(`message:${e.message}`);
};

module.exports = router;
