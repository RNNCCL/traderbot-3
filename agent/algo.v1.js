{
  "algorithms": [{
    "id": 0,
    "bot_id": 0,
    loop: true,
    loop_time_interval: "1 hour",

    local_values: [{
      "value_pool": null,
      "median": null,
      "value_pool_range": null,
      "max_high": null,
      "max_low": null,
      "high_value_pool": null,
      "high_value_median": null,
      "low_value_pool": null,
      "low_value_median": null
    }],

    commands: [
      {
        "id": 0,
        "type": "VALUE_POOL",
        "time_interval": 1 //in hours
        "set_local_values": {
          "value_pool": "value_pool",
          "median": "median",
          "value_pool_range": "value_pool_range",
          "max_high": "max_high",
          "max_low": "max_low",
          "high_value_pool": "high_value_pool",
          "high_value_median": "high_value_median",
          "low_value_pool": "low_value_pool",
          "low_value_median": "low_value_median"
        }
      }
    }]

  ]
}


db.algorithms.insert({
  "bot_id": ObjectId("5397cdc78d1c22bf4fee7091"),
  name: "wings",
  loop: true,
  loop_time_interval: 1,

  local_values: [
    {"value_pool": null},
    {"median": null},
    {"value_pool_range": null},
    {"max_high": null},
    {"max_low": null},
    {"high_value_pool": null},
    {"high_value_median": null},
    {"low_value_pool": null},
    {"low_value_median": null}
  ],

  commands: [
    {
      "type": "VALUE_POOL",
      "time_interval": 1,
      "set_local_values": {
        "value_pool": "value_pool",
        "median": "median",
        "value_pool_range": "value_pool_range",
        "max_high": "max_high",
        "max_low": "max_low",
        "high_value_pool": "high_value_pool",
        "high_value_median": "high_value_median",
        "low_value_pool": "low_value_pool",
        "low_value_median": "low_value_median"
      }
    }
  ]
});

//LEFT OFF HERE, GET THE BELOW TO RUN ... 
db.algorithms.update(
  { _id: "539a690c242971f0e5ccc2f9" },
  {
     $set: { 
      name: "wings",
      loop: true,
      loop_time_interval: 1,

      local_values: [
        {"value_pool": null},
        {"median": null},
        {"value_pool_range": null},
        {"max_high": null},
        {"max_low": null},
        {"high_value_pool": null},
        {"high_value_median": null},
        {"low_value_pool": null},
        {"low_value_median": null}
      ],
      commands: [
        {
          "type": "VALUE_POOL",
          "time_interval": 1,
          "set_local_values": {
            "value_pool": "value_pool",
            "median": "median",
            "value_pool_range": "value_pool_range",
            "max_high": "max_high",
            "max_low": "max_low",
            "high_value_pool": "high_value_pool",
            "high_value_median": "high_value_median",
            "low_value_pool": "low_value_pool",
            "low_value_median": "low_value_median"
          }
        }
      ]
    }
  }
);



{
  'bots': [{
    id: 0,
    name: "Fledgling",
    usd_balance: "20.00",
    algorithm_ids: [0]
  }]
}


db.bots.insert({
    name: "Fledgling",
    usd_balance: "20.00",
    algorithm_ids: [0]
});

db.bots.update({
  { _id: "539a690c242971f0e5ccc2f9" },
  { 
    $set : {
      algorithm_ids: [ObjectId("53acd2c375a0acd14b024355")]
    }
  }
})


ALGORITHM:
ObjectId("53acd2c375a0acd14b024355")

BOT:
ObjectId("53acd75675a0acd14b024356")

db.bots.insert(
   { 
    name: "Fledgling",
    usd_balance: "20.00",
    "algorithm_ids": [ ObjectId("53acd2c375a0acd14b024355") ] 
  }
);
