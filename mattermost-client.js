let Mattermost = require('mattermost');
let client;
if (!client) {
  client = new Mattermost.Client();
}

client.setUrl("http://localhost:8065");
client.useToken = true;

module.exports = client;
