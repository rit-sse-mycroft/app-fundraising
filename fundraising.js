var mycroft = require('mycroft');
var client = mycroft.Mycroft('fundraising', 'app.json', 'localhost', 1847)
var items = require('./items.json');

var sentGrammar = false;

//Handler for CONNECTION_CLOSED
client.on('CONNECTION_CLOSED', function(data){
  client.query('stt', 'unload_grammar', {grammar: 'fundraising'});
});

// Handler for APP_DEPENDENCY
client.on('APP_DEPENDENCY', function(data){
  client.updateDependencies(data);
  if(client.dependencies.stt !== undefined && client.dependencies.tts !== undefined) {
    if(client.stt.stt1 === 'up' && !sentGrammar){
      var grammarData = {
        grammar: {
          name: 'fundraising',
          xml: fs.readFileSync('./grammar.xml').toString()
        }
      };
      app.query(client, 'stt', 'load_grammar', grammarData, ['stt1'], 30);
      sentGrammer = true;
    }else if(client.dependencies.stt.stt1 === 'down' && sentGrammar){
      sentGrammar = false;
    }
    if(client.status.down && client.dependencies.tts.text2speech === 'up' && client.dependencies.stt.stt1 === 'up'){
      up();
    }else if(client.status.up && (client.dependencies.tts.text2speech === 'down' || client.dependencies.stt.stt1 === 'down')){
      down();
    }
  }
});

// Handler for MSG_BROADCAST
client.on('MSG_BROADCAST', function(data){
  if(data.content.grammar === 'fundraising'){
    itemName = data.tags.item;
    item = findItemName(itemName);
  } else if(data.content.barcode !== undefined){
    barcode = data.content.barcode;
    item = findItemBarcode(barcode);
  }
  if(item !== null){
    message = "The price of " + item.name + " is " + item.price;
    tts_message = [{phrase: message, delay: 0}];
    client.query('tts', 'stream', tts_message);
  }
});

// Find an item based on its barcode
function findItemBarcode(barcode){
  for(i = 0; i< items.length; i++){
    if(items[i].barcodes.indexOf(barcdoe) !== -1){
      return items[i];
    }
  }
  return null;
}

// Find an item based on its name
function findItemName(name){
  for(i = 0; i < items.length; i++){
    if(items[i].name === name || items[i].otherNames.indexOf(name) !== -1){
      return items[i];
    }
  }
  return null;
}

client.connect();
client.sendManifest();