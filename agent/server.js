//var koa = require('koa'),
//route = require('koa-route'),
//request = require('koa-request'),
//app = module.exports = koa(),
var crypto = require('crypto'),
Bitstamp = require('bitstamp'),
bitstamp = new Bitstamp,
mongoose = require('mongoose'),
Pusher = require('pusher-client');

//Configuration 
var pusherBitstampApiKey = 'de504dc5763aeef9ff52';
//Config for Environment: Bitstamp
var key = 'v0QzswYmIGEMS28tvlZwfMfeuco4hjb6';
var secret = '6RSR6ZIj0bu5hJ2PfP2TGABwWkY70c99';
var client_id = 360591; // your Bitstamp user ID

//Connection to database
mongoose.connect('mongodb://localhost/agent');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error:'));

// Agent Scout: responsible for collecting trade data and storing it in the agent database.
/*
var socket = new Pusher(pusherBitstampApiKey);
var tradesChannel = socket.subscribe('live_trades');

var environmentTradeSchema = mongoose.Schema({
    type: String, //bitstamp
    amount: Number, //0.18983592
    price: Number,
    date: { type: Date, default: Date.now }
});
var environmentTrade = mongoose.model('environmentTrade', environmentTradeSchema);

db.once('open', function callback () {
  console.log('successfully connected to database');

  socket.bind('trade',
    function(data) {
      // data { price: 582.8, amount: 0.18983592, id: 5043036 }
      console.log('data', data);
      var environmentTradeInstance = new environmentTrade({ type: 'bitstamp', amount: data.amount, price: data.price });
      environmentTradeInstance.save(function (err, environmentTrade) {
        if (err) return console.error(err);
      });
    }
  );
});
*/


//Agent Intrepeter

var Intrepeter = function() {}

var Bot = function(botData) {
  this.name = botData.name;
  this.usdBalance = botData.usd_balance;
  this.algorithms = botData.algorithm_ids;
} 

var Algorithm = function(algorithmData) {
  this.name = algorithmData.name;
  this.loop = algorithmData.loop;
  this.loopTimeInterval = algorithmData.loop_time_interval;
  this.localValues = algorithmData.local_values;
  this.commands = algorithmData.commands;
  this.bot = algorithmData.bot_id;
}

Intrepeter.prototype._fetchBots = function() {
  var botSchema = mongoose.Schema({
      name: String,
      usd_balance: String,
      algorithm_ids: [{ type: mongoose.Schema.ObjectId, ref: 'Algorithm' }]
  });
  var Bot = mongoose.model('Bot', botSchema);
  var bots = Bot.find({}).exec();
  return bots;
}

Intrepeter.prototype._fetchAlgorithms = function(algorithmIds) {
  console.log('inside _fetchAlgorithms');
  console.log('value of algorithmIds', algorithmIds);
  var algorithmSchema = mongoose.Schema({
      name: String,
      bot_id: mongoose.Schema.Types.ObjectId,
      loop:  Boolean,
      loop_time_interval: String,
      local_values: { type : Array , "default" : [] },
      commands: { type : Array , "default" : [] }
  });
  //console.log('algorithmSchema', algorithmSchema);
  var Algorithm = mongoose.model('Algorithm', algorithmSchema);
  var findQuery = { $or: [] };
  algorithmIds.forEach( function(algorithmId) {
    findQuery.$or.push({ '_id': mongoose.Types.ObjectId(algorithmId) });
  });
  var algorithms = Algorithm.find(findQuery).exec();
  return algorithms;
}


//Step 1. Start by fetching all bots.
intrepeter = new Intrepeter;

intrepeter._fetchBots().then( function(bots) {
  bots.forEach( function(botData) {
    //Consider adding bot to the intrepreter 
    var bot = new Bot(botData);
    console.log('bot.algorithms', bot.algorithms);
    //Step 2. For each bot, fetch the alogrithms for executing.
    intrepeter._fetchAlgorithms(bot.algorithms).then( function(algorithmsData) {
      //console.log('algorithmsData', algorithmsData);
      
      algorithmsData.forEach( function(algorithmData) {
        
        //Step 3. For each algorithm execute the instructions/commands. 
        var algorithm = new Algorithm(algorithmData);

        algorithm.commands.forEach( function(commandData) {
          console.log('command', commandData);
          //intrepeter.
        });

      });

    }, function(error) {
      console.log('error', error);
    });

  });
});























/** The below code requires koa.js dependencies

//Bitstamp Public API: Ticker
app.use(route.get('/ticker', ticker));

function *ticker() {
  var options = {
      url: 'https://www.bitstamp.net/api/ticker/',
      headers: { 'User-Agent': 'request' }
  };

  var response = yield request(options); //Yay, HTTP requests with no callbacks!
  var info = JSON.parse(response.body);
  console.log('info', info);

  //this.body = 'info:' + info;
  this.body = response.body;
}

app.use(route.get('/account_balance', accountBalance));

function *accountBalance() {

  var key = 'v0QzswYmIGEMS28tvlZwfMfeuco4hjb6';
  var secret = '6RSR6ZIj0bu5hJ2PfP2TGABwWkY70c99';
  var client_id = 360591; // your Bitstamp user ID
  var privateBitstamp = new Bitstamp(key, secret, client_id);

  var result = privateBitstamp.balance(console.log);
  
  //this.body = 'info:' + info;
  this.body = result;
}

function *authenticate(nonce, key, secret, client_id) {
  var message = nonce  + client_id + key;
  //var message = nonce.concat(client_id, key);
  //var signature = crypto.createHmac('SHA256', secret).update(message).digest('hex').toUpperCase();
  var signer = crypto.createHmac('sha256', new Buffer(secret, 'utf8'));
  var signature = signer.update(message).digest('hex').toUpperCase();
  return signature;
}

app.listen(process.env.PORT || 8080);





//OLD POST ATTEMPT BELOW:

/*
  var data = querystring.stringify({
    key : key,
    signature  : signature,
    nonce : nonce
  });

  var options = {
      url: 'https://www.bitstamp.net/api/balance/',
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/4.0', 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
  };
  console.log('data', Buffer.byteLength(data))
  var response = yield request.post(options); //Yay, HTTP requests with no callbacks!
  var info = JSON.parse(response.body);
  console.log('info', info);
*/