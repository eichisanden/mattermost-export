let express = require('express');
let router = express.Router();
let client = require('../mattermost-client');
let result = {};

let thisRes;
router.post('/', function(req, res, next) {
  thisRes = res;
  client.login('eichisanden', 'redking', '', successLogin, error);
});

let successLogin = (resbody, res) => {
  client.getMe(successGetMe, error);
};

let successGetMe = (resbody, res) => {
  result.id = resbody.id;
  result.username = resbody.username;
  result.email = resbody.email;
  result.nickname = resbody.nickname;
  client.getAllTeams(successGetAllTeams, error);
};

let successGetAllTeams = (resbody, res) => {
  console.log(resbody);
  result.channels = [];
  for (let teamId in resbody) {
    console.log(teamId);
    client.setTeamId(teamId);
    client.getChannels(successGetChannels, error);
  }
  console.log(result);
  thisRes.render('top', result);
};

let successGetChannels = (resbody, res) => {
  console.log(resbody);
  let obj = {};
  obj.id = resbody.id;
  obj.name = resbody.display_name;
  result.channels.push(obj);
};

let error = (e, err, res) => {
  console.log("error")
  console.log(e);
  console.log(err);
};

module.exports = router;
