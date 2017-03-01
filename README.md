# property-seek

Non-destructive property access and manipulation for javascript.

Supports searching objects using the following syntax:

```javascript

  var property = require('property-seek');
  
  var user = { 
    name: { 
      first: 'Joe', 
      last: 'M',
    'dot.name':'Joe.M'
    },
    'dot.value':12
  };
  
  // get
  property('name.first', user);                 // 'Joe'
  property('name[first]', user);                // 'Joe'
  property("'dot.name'", user);                 // 'Joe.M'
  property("name['dot.value']");                // 12

  // or use it to set values, the original object is not modified!
  property('name', 'T', user);         //{name: 'T', 'dot.value':12}
  ```

## Installation

```sh
 npm install --save property-seek
```
## Test
```sh
npm test
```

## License

MIT (c) Lasana Murray
