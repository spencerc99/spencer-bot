var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^spencer bot$/gi,
      botRegex2 = /^ugh$/gi;

  if(request.text && (botRegex.test(request.text) || botRegex2.test(request.text))) {
    this.res.writeHead(200);
    postMessage(request.text, botRegex, botRegex2);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(message, botRegex, botRegex2) {
  var botResponse, options, body, botReq;
  if (botRegex.test(message)) {
    botResponse = cool() + " Hello, what is up? " + cool();
  } else  {
    botResponse = "I'm sorry to hear that.";
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
