const express = require('express');
const router = express.Router();
const client = require('../mattermost-client');

router.post('/', function(req, res, next) {
  const teamId = req.body.teamId;
  const channelId = req.body.channelId;
  getTeamMembers(teamId, channelId).then(getPosts).then((result) => {
    res.attachment('export.csv');
    res.send(new Buffer(result));
  });
});

function getTeamMembers(teamId, channelId) {
  const p = new Promise((resolve, reject) => {
    client.setTeamId(teamId);
    client.getTeamMembers(teamId, (resbody, res) => {
      console.log(resbody);
      resolve(teamId, channelId, resbody);
    }, error);
  });
  return p;
}

function getPosts(teamId, channelId, members) {
  const p = new Promise((resolve, reject) => {
    client.setTeamId(teamId);
    client.getPostsPage(channelId, 0, 100, (resbody, res) => {
      let csv = '"Create_at","User_id","Message"\n'
      for (let postId of resbody.order.reverse()) {
        const post = resbody.posts[postId];
        csv += '"' + dateToString(post.create_at) + '","' + post.user_id + '","' + post.message + '"\n'
      }
      resolve(csv);
    }, error);
  });
  return p;
}

function dateToString(milisec) {
  let d = new Date(milisec);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString()}`
}

let error = (e, err, res) => {
  console.log("===============================")
  console.log("Error")
  console.log("===============================")
  console.log(`status_code:${e.status_code}`);
  console.log(`detailed_error:${e.detailed_error}`);
  console.log(`message:${e.message}`);
  console.log(err);
};

module.exports = router;
