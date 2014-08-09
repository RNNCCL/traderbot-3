//var koa = require('koa'),
//route = require('koa-route'),
//request = require('koa-request'),
//app = module.exports = koa(),
var crypto = require('crypto'),
Bitstamp = require('bitstamp'),
bitstamp = new Bitstamp,
mongoose = require('mongoose');

// Config for Environment: Bitstamp
var key = 'v0QzswYmIGEMS28tvlZwfMfeuco4hjb6';
var secret = '6RSR6ZIj0bu5hJ2PfP2TGABwWkY70c99';
var client_id = 360591; // your Bitstamp user ID

// Database Connection
mongoose.connect('mongodb://localhost/agent');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error:'));


// Common Functions and Utilities



// Namespace
var Agent = Agent || {};

// Common Functions and Utilities
Agent.addFloat = function(a, b) {
  return parseFloat(a) + parseFloat(b);
}

Agent.findMedian = function(values) {
  values.sort( function(a,b) {return a - b;} );

  var half = Math.floor(values.length/2);

  if(values.length % 2)
      return values[half];
  else
      return (values[half-1] + values[half]) / 2.0;

}

String.prototype.toCamel = function() {
  return this.replace(/([-_][a-z])/g, function($1){return $1.toUpperCase().replace(/[-_]/,'');});
};

// Agent Intrepeter
var Intrepeter = function() {
  console.log('Intrepeter start');
}

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

// Command class
Agent.Command = function(commandData) {
  this.identify = function(type) {
    var type = (type == undefined)?this.type:type;
    switch (type) {
      case 'VALUE_POOL':
        return type.toLowerCase().toCamel();
        break;
      default:
        console.log('Error: Command was unable to be identified.');
        return null;
        break;
    }
    this.commandData = function() {
      return commandData;
    }
  }


  this.init = function() {
    this.type = commandData.type;
    //finish assigning everything to object that exists in commandData
  }
  this.init();

}

// Command: valuePool 
Agent.valuePool = function(commandData) {
  
  this.values = [];

  // 1) Get the time interval from commandData. Should be hours integer.
  this.timeInterval = commandData.time_interval;
  
  // 2) Fetch all trades in that time interval.
  var environmentTrades = new Agent.environmentTrade();
  // use timeInterval to set query to pass in find().
  // in the future we made need to specify environment

  var self = this;
  environmentTrades.find().then( function(environmentTradesData) {

    environmentTradesData.forEach( function(environmentTradeData) {
      //console.log('environmentTrade', typeof(environmentTradeData));
      //console.log('inside, self', self);
      self.values.push(environmentTradeData.price);
    });
    console.log('self values', self.values);

    self.valuePoolSum = self.values.reduce(Agent.addFloat, 0);
    self.valuePoolSum = self.valuePoolSum.toFixed(2);
    self.count = self.values.length;
    self.medianValue = self.valuePoolSum / self.count;
    self.values.sort();
    self.maxHigh = self.values[self.count - 1];
    self.maxLow = self.values[0];
    self.valuePoolRange = (parseFloat(self.maxHigh) - parseFloat(self.maxLow)).toFixed();

    self.sellThreshold = 75;
    self.actionableHigh = (self.sellThreshold / 100) * self.valuePoolRange;
    // add the lowest 
    self.actionableHigh = parseFloat(self.actionableHigh) + parseFloat(self.maxLow);

    self.highValuePool = [];
    self.values.forEach( function(num) {
      if (num >= self.actionableHigh) {
        self.highValuePool.push(num);
      }
    });

    self.highValuePoolSum = self.highValuePool.reduce(Agent.addFloat, 0);
    self.highValuePoolSum = self.highValuePool.toFixed(2);
    self.highValuePoolMedian = self.highValuePoolSum / self.highValuePool.length;

    //Now do the low value pool values.

    console.log('length of values', self.values.length);
    console.log('length of high value pool', self.highValuePool.length);
    console.log('high Value pool', self.highValuePool);

    self.actionableLow = 25; // user set percentage, hard-coded for now ...
    self.actionableLow = (self.actionableLow / 100) * self.valuePoolRange;
    // add the lowest to value
    self.actionableLow = parseFloat(value) + parseFloat(self.maxLow);

    self.lowValuePool = [];
    self.values.forEach( function(num) {
      if (num < self.actionableLow) {
        self.lowValuePool.push(num);
      }
    });
    self.lowValuePoolSum = self.lowValuePool.reduce(Agent.addFloat, 0);
    self.lowValuePoolSum = self.lowValuePool.toFixed(2);
    self.lowValuePoolMedian = self.lowValuePoolSum / self.lowValuePool.length;

/*
    console.log('valuePoolRange', self.valuePoolRange);
    console.log('maxHigh', self.maxHigh);
    console.log('maxLow', self.maxLow);
    console.log('median', self.medianValue);
*/

  }, function(error) {
    console.log('error', error);
  });
}

Agent.environmentTrade = function() {
  console.log('environmentTrade');
  this.schema = mongoose.Schema({
      type: String,
      amount: Number,
      price: String,
      date: Date 
    });
  this.find = function(queryParameters) {
    var queryParameters = ((!queryParameters)?{}:queryParameters);
    var environmentTrade = mongoose.model('environmentTrade', this.schema);
    var query = environmentTrade.find(queryParameters).exec();
    return query;
  }
}

Agent.prioritizer = function(prioritizer) {

 this.checkCondition = function() {
  // will read the prioritizer condition, operator and value, and set condition to true or false.
  console.log('checking condition ...');
  if (prioritizer) {

  } else {
    console.log('set condition to true, because prioritizer is null');
    this.condition = true;
  }
 };
 this.checkResolution = function() {
  // return true UNTIL condition is set to true from checkCondition. 
  if (this.condition) {
    return false;
  } else {
    return true;
  }
 };
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

console.log('Test true');

//Step 1. Start by fetching all bots.
intrepeter = new Intrepeter;
console.log('After Intrepeter');

intrepeter._fetchBots().then( function(bots) {
  console.log('bots', bots);
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
          
          var prioritizer = new Agent.prioritizer(commandData.prioritizer);
          // do checking of object prioritizer while condition is not met.
          do {
            prioritizer.checkCondition();
          } while ( prioritizer.checkResolution() );

          var command = new Agent.Command(commandData);
          var commandType = command.identify();
          var executeCommand = new Agent[commandType](commandData);
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