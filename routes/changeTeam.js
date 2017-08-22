let express = require('express');
let router = express.Router();
let client = require('../mattermost-client');
let result = {};

router.get('/', function(req, res, next) {
  getChannels(req.query.teamId).then(() => {res.json(result)});
});

function getChannels(teamId) {
  result.channels = [];  
  client.setTeamId(teamId);  
  const p = new Promise((resolve, reject) => {
    client.getChannels((resbody, res) => {
      console.log("start getChannels");
      for (const channel of resbody) {
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
