## API LOOKUP VARIABLES:

$BTC_PRICE = Current bitstamp environment price.
$BOT_BALANCE = Current total parent bot balance.

## API COMMANDS:

/**
  VALUE POOL
    -the agent looks up historical trades for environment
    -returns the value pool of trade prices in the last time interval numerically sorted
    -sets the local value that will store this set of values
**/

{
  "id": 0,
  "type": "VALUE_POOL",
  "time_interval": 1, //in hours
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
