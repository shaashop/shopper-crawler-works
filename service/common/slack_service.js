// load Service
const Slack = require('slack-node');
// eslint-disable-next-line node/no-unpublished-require
const alram = require('../../config/local').customer.get('alram');

// SlackService
class SlackServiceClass {
  async slackWebHook(webhookUri, channel, userName, message) {
    if (!alram) return false;
    const slack = new Slack();
    slack.setWebhook(webhookUri);
    const send = async (message) => {
      slack.webhook(
        {
          channel: channel ? channel : '#general', // 전송될 슬랙 채널
          username: userName ? userName : 'webhookbot', //슬랙에 표시될 이름
          text: message,
        },
        function (err, response) {
          console.log(err);
          console.log(response);
        },
      );
    };
    await send(message);
  }
}

module.exports = SlackServiceClass;
