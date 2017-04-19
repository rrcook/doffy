let Promise = require("bluebird");
let force = require('./force');
let Alexa = require('alexa-app');
let skillService = new Alexa.app('doffy');


skillService.launch((request, response) => {
  let prompt = `Hello. I will tell you about DOF 2 point 0 stats`;
  response.say(prompt).reprompt(prompt).shouldEndSession(true);
});

skillService.intent('errorintent', {
  'utterances': ['for the latest errors']
  },
  (request, response) => {
    //get the slot
    return force.login()
    .then(() => force.findErrors())
    .then(results => {
      let responseText = '';
      results.map(result => {
        responseText += `Account ${result._fields.account.Name} has the error ${result._fields.remote_order_status_message__c}, `;
      });
      response.say(responseText).shouldEndSession(true).send();
    }).catch(err => {
      console.log(err);
      response.say(`I can't get the deals because of ${err}`);
      // return response.send();
    });
  }
);

module.exports = skillService;
