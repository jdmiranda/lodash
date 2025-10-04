const _ = require('./lodash.js');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;

// Test data structures
const shallowObject1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
const shallowObject2 = { f: 6, g: 7, h: 8, i: 9, j: 10 };

const deepObject1 = {
  user: { name: 'John', age: 30, address: { city: 'NYC', zip: '10001' } },
  settings: { theme: 'dark', notifications: true }
};
const deepObject2 = {
  user: { email: 'john@example.com', address: { country: 'USA' } },
  settings: { language: 'en' }
};

const complexDeep1 = {
  level1: {
    level2: {
      level3: {
        level4: {
          data: [1, 2, 3],
          meta: { type: 'test' }
        }
      }
    }
  }
};
const complexDeep2 = {
  level1: {
    level2: {
      level3: {
        level4: {
          data: [4, 5, 6],
          extra: { flag: true }
        }
      }
    }
  }
};

const arrayMerge1 = { items: [1, 2, 3], tags: ['a', 'b'] };
const arrayMerge2 = { items: [4, 5, 6], tags: ['c', 'd'] };

// Benchmark tests
suite
  .add('Shallow object merge', function() {
    _.merge({}, shallowObject1, shallowObject2);
  })
  .add('Deep object merge', function() {
    _.merge({}, deepObject1, deepObject2);
  })
  .add('Complex deep merge (4 levels)', function() {
    _.merge({}, complexDeep1, complexDeep2);
  })
  .add('Array merge', function() {
    _.merge({}, arrayMerge1, arrayMerge2);
  })
  .add('Multiple source merge (3 sources)', function() {
    _.merge({}, shallowObject1, shallowObject2, { k: 11, l: 12 });
  })
  .add('Cached merge (same objects)', function() {
    const target = {};
    _.merge(target, deepObject1);
    _.merge(target, deepObject1); // Should hit cache
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
    const opsPerSec = event.target.hz.toFixed(0);
    console.log(`  → ${opsPerSec} merges/sec`);
  })
  .on('complete', function() {
    console.log('\n=== Benchmark Complete ===');
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': false });
