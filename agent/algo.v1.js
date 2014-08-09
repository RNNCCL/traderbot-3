db.createCollection("agent");

db.bots.insert(
   {
    _id: ObjectId("5397cdc78d1c22bf4fee7091"),
    name: "Fledgling",
    usd_balance: "20.00",
    "algorithm_ids": [ ObjectId("53acd2c375a0acd14b024355") ]
  }
);

db.algorithms.insert({
  _id: ObjectId("53acd2c375a0acd14b024355"),
  bot_id: ObjectId("5397cdc78d1c22bf4fee7091"),
  name: "wings",
  loop: true,
  loop_time_interval: 1,
  enabled: true,

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
      "actionable_high": 75%,
      "actionable_low": 15%,
      "set_local_values": [
        {"value_pool": "value_pool"},
        {"median": "median"},
        {"value_pool_range": "value_pool_range"},
        {"max_high": "max_high"},
        {"max_low": "max_low"},
        {"high_value_pool": "high_value_pool"},
        {"high_value_median": "high_value_median"},
        {"low_value_pool": "low_value_pool"},
        {"low_value_median": "low_value_median"}
      ],
      prioritizer: null
    },
    {
      "type": "BUY",
      "amount": "5.00",
      "prioritizer": {
        "condition": "$CURRENT_PRICE",
        "operator": "<=",
        "value": "$this.actionableLow"
      }
    }
  ]
});

db.algorithms.update(
   { "_id" : ObjectId("53acd2c375a0acd14b024355") },
   {
      $set: {
        "prioritizer": null
      }
   }
);

