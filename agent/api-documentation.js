
// API for Algorithm
{
  'algorithms': [
    {
      id: '40',
      name: "TEST Algorithm",
      time_interval: '1 week',
      test_value: "",
      loop: true,
      loop_time_interval: "1 hour", // will be null if loop is null
      bot_id: 0,
      performance_history_id: 1,

      local_values: [
       starting_btc_price: '$500',
       buy_spending_limit: '$.25'
      ],

      commands: [
        {
          id: 0,
          type: 'IF',
          condition: '$BTC_CURRENT_PRICE', // BTC VOLUME, $BTC_15_MIN_PAST_PRICE, BTC_30_MIN_PAST_PRICE
          operator: 'greater than', // greater than, less than, greater than or equal to
          value: '$starting_btc_price * 125%',
          then_type: 'algorithm', //command, algorithm
          then_id: 1
        },
        {
          id: 1,
          type: 'WAIT',
          value: 10
        },
        {
          id: 2,
          type: 'UPDATE_USER_VALUE',
          name: 'starting_btc_price',
          value: '$starting_btc_price + %30'
        },
        {
          id: 3,
          type: 'BUY',
          value: '$buy_spending_limit',
          exchange: 'bitstamp'

        },
        {
          id: 4,
          type: 'OBSERVE',
          entity_type: 'bot',

        }

      ]
    },
    {
      id: '1',
      name "WAIT YOUR SOCKS OFF",
      loop: false,40
      commands: [{
          id: 0,
          type: 'WAIT',
          value: 5
        }
      ]
    }
    ...
  ]
}




// ADDRESSING TRACKING PERFORMANCE:
// Resources (bots and algorithms) may be UPDATED.
//   Each time a bot is updated a new bot history object is stored. 

//  Each time an algorithm is updated, removed, or added a new algorithm history object is stored.
//    When this happens, a new history bot parent object is created and stored with the new updated history algorithm ids.



//BOTS API

{
  'bots': [{
    id: 0,
    name: "Money Maker 2000",
    usd_balance: "200.00",
    time_interval: "1 week",
    algorithm_ids: [40]
  }]
}



//BOTS HISTORY API
{
  'bots_histories': [{
    id: 042,
    bot_id: 0,
    name: "Money Maker 2000",
    usd_balance: "100.00",
    algorithm_history_ids: [89],
    timestamp: '32144325439435'
  },
  {
    id: 043,
    bot_id: 0,
    name: "Money Maker 2000",
    usd_balance: "100.00",
    algorithm_history_ids: [88],
    timestamp: '23483247582349'
  }]
}


// ALGORITHM HISTORY API

{
  'algorithm_histories': [
    id: 88,
    algorithm_id: 40,
    name: "Master algoritm Level 1"
  }]
}




// TRADES HISTORY API

{
  'trades': [{
    id: '23487324983274',
    timestamp: '',
    type: 'BUY', // OR SELL
    amountReceived: '1.4',
    amountRecievedType: 'bitcoin',
    amountSent: '600',
    amountSentType: 'USD',
    bot_history_id: 042,
    algorthm_history_id: 1,
    environment_id: 'bitstamp'
  }]
}



//ALGORITHM HISTORY API






















