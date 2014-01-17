var app = require('./app.js');
var client = app.connectToMycroft();
var PRICELIST = require('./prices.json');

app.sendManifest(client, './app.json');
PRICES = JSON.parse(PRICELIST);

var verified = false; //Set to true when APP_MANIFEST_OKAY received

client.on('data', function (data) {
  parsed = app.parseMessage(data);
  //Check the type of ths message
  if (parsed.type === 'APP_MANIFEST_OK' || 'APP_MANIFEST_FAIL') {
    var dependencies = app.manifestCheck(data);
    verified = true;

  } else if (parsed.type === 'MSG_QUERY') {
    console.log('Query received');
    if (parsed.data['action'] === 'getPrice'){
      message = getPrices(parsed.data);
      app.query(client, 'tts', 'stream', {text: message, targetSpeaker: "speakers"}, 30);
    }

  } else if (parsed.type === 'MSG_BROADCAST') {
    console.log('Broadcast received');
    if (checkBroadcast(parsed.content)){
      message = getPrices(parsed.content);
      app.query(client, 'tts', 'stream', {text: message, targetSpeaker: "speakers"}, 30);
    }

  } else if (parsed.type === 'MSG_QUERY_SUCCESS') {
    console.log('Query successful');

  } else if (parsed.type === 'MSG_QUERY_FAIL') {
    console.error('Query Failed.');
    throw parsed.data.message;

  } else {
    console.log('Message Receieved');
    console.log(' - Type: ' + parsed.type);
    console.log(' - Message:' + JSON.stringify(parsed.data));
  }
  
  if(dependencies){
  	if(dependencies.logger == 'up'){
  		app.up(client);
  	}
  }
});

client.on('end', function() {
  console.log('client disconnected');
});

function checkBroadcast(content){
  return ((content['action'] === 'price') || (content['action'] === 'cost'));
}

function getPrices(data){
  price = PRICES[data['item']];
  if (price === null){
  	message = ("I was unable to find the price of the item you requested.");
    return message;
  }
  message = (data['item'] + " costs " + price);
}