'use strict';
const BootBot = require('../');
const config = require('config');
var request = require('request');


const bot = new BootBot({
  accessToken: config.get('access_token'),
  verifyToken: config.get('verify_token'),
  appSecret: config.get('app_secret')
});

var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
  username: '56b7bed0-65de-45ed-95ac-10d4001daf05',
  password: 'zt1eIwnSYasi',
  version_date: ConversationV1.VERSION_DATE_2017_05_26
});

bot.on('message', (payload, chat) => {
  const textIn = payload.message.text;
  conversation.message({
  input: { text: textIn },
  workspace_id: '712cb424-5e03-4490-9c39-9e5f0ac8c53a'
 }, function(err, response) {
     if (err) {
       console.error(err);
     } else {
       var text = response.output.text;
       
       if(text.indexOf("show_waitingtime") > -1)
       {
			request.post(
			    'http://appy.brusselsairport.be/webservice/v1/get_waitingtime.json',
			    { id: '1573064814', version: "1.1" },
			    function (error, response, body) {
				    var answer = "";
			        if (!error && response.statusCode == 200) {				        
				        JSON.parse(body).result.forEach(function(element) {
						     answer += "The waiting time for Terminal " + element.zone + " is less than 5 minutes. ";
						});		
						chat.say("" + answer); 
			        }  
			    }
			);
	   }
       else
       {
	      chat.say("" + response.output.text); 
       }
     }
});

});

bot.start("80");
