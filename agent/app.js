var express = require('express');
var app = express();

app.get('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }
var q = quotes[req.params.id];
  res.json(q);
});

app.listen(process.env.PORT || 4730);