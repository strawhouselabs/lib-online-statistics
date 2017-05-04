lib-online-statistics
---------------------

A simple class for tracking mean, variance and standard deviation in an online fashion.

*Example use*
```js
const OnlineStatistics = require('lib-online-statistics');
const o = new OnlineStatistics();
o.observe(1);
console.log(o.mean()); // prints 1
o.observe(2);
console.log(o.mean()); // prints 1.5
```

Available methods on the object are
`observe(record)` - observe a new data point.

`mean()` - get the mean so far.

`variance(sample = false)` - get the variance so far (sample or population).

`standardDeviation(sample = false)` - get the corrected standard deviation (sample or population).

The stateful tracker can be serialized for storage in a file or database with `JSON.stringify` and provides a static `fromJSON` method.
