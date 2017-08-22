const express = require('express');
const router = express.Router();
const client = require('../mattermost-client');
const result = {};

router.post('/', (req, res, next) => {
  login().then(getMe).then(getAllTeams).then(() => {console.log("end all"); console.log(result);res.render('top', result);});  
});

function login() {
  const p = new Promise((resolve, reject) => {
    console.log("start login");
    client.login('eichisanden', 'redking', '', () => {console.log("end login"); resolve();}, error);
  });
  return p;
}

function getMe() {
  const p = new Promise((resolve, reject) => {
    console.log("start getMe");
    client.getMe((resbody, res) => {
        result.id = resbody.id;
        result.username = resbody.username;
        result.email = resbody.email;
        result.nickname = resbody.nickname;    
        console.log("end getMe");
        resolve();
      },
      error);
  });
  return p;
}

function getAllTeams() {
  const promises = [];
  result.channels = [];
  const p = new Promise((resolve, reject) => {
    console.log("start getAllTeams");
    client.getAllTeams((resbody, res) => {
        for (const teamId in resbody) {
          client.setTeamId(teamId);
          promises.push(getChannels());
        }
        Promise.all(promises).then(() => {resolve();});
        console.log("end getAllTeams");
      },
      error);
  });
  return p;
}

function getChannels() {
  const p = new Promise((resolve, reject) => {
    client.getChannels((resbody, res) => {
      console.log("start getChannels");
      console.log(resbody);
      for (const channel of resbody) {
        console.log(channel);
        const obj = {};
        obj.id = channel.id;
        obj.name = channel.display_name;
        result.channels.push(obj);  
      }
      console.log("end getChannels");
      resolve();
    }, error);
  });
  return p;
}

let error = (e, err, res) => {
  console.log("===============================")
  console.log("Error")
  console.log("===============================")
  console.log(`status_code:${e.status_code}`);
  console.log(`detailed_error:${e.detailed_error}`);
  console.log(`message:${e.message}`);
};

module.exports = router;
