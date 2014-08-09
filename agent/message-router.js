/**
* Message Router
* Responsible for collecting trade data and storing it in the agent database.
* @class
*/

var Pusher = require('pusher-client'),
mongoose = require('mongoose');

//Configuration 
var pusherBitstampApiKey = 'de504dc5763aeef9ff52';

var socket = new Pusher(pusherBitstampApiKey);
var tradesChannel = socket.subscribe('live_trades');

//Connection to database

mongoose.connect('mongodb://localhost/agent');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error:'));

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