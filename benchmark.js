/**
 * Comprehensive Lodash Performance Benchmark
 * Tests the top 20 most-used methods with various data sizes
 */

const _ = require('./lodash.js');
const Benchmark = require('benchmark');

// Test data generators
function generateArray(size) {
  return Array.from({ length: size }, (_, i) => i);
}

function generateObjectArray(size) {
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `item${i}`,
    value: Math.random() * 100,
    nested: { score: i * 2 }
  }));
}

function generateObject(size) {
  const obj = {};
  for (let i = 0; i < size; i++) {
    obj[`key${i}`] = `value${i}`;
  }
  return obj;
}

function generateNestedObject() {
  return {
    a: { b: { c: { d: { e: 'deep value' } } } },
    user: { profile: { name: 'John', age: 30 } },
    data: { items: [1, 2, 3], count: 3 }
  };
}

// Data sets
const smallArray = generateArray(10);
const mediumArray = generateArray(100);
const largeArray = generateArray(1000);

const smallObjArray = generateObjectArray(10);
const mediumObjArray = generateObjectArray(100);
const largeObjArray = generateObjectArray(1000);

const smallObject = generateObject(10);
const mediumObject = generateObject(100);
const nestedObject = generateNestedObject();

// Benchmark suites
const suites = [];

// 1. _.map benchmarks
suites.push(new Benchmark.Suite('_.map')
  .add('map - small array (10 items)', () => {
    _.map(smallArray, x => x * 2);
  })
  .add('map - medium array (100 items)', () => {
    _.map(mediumArray, x => x * 2);
  })
  .add('map - large array (1000 items)', () => {
    _.map(largeArray, x => x * 2);
  })
  .add('map - object array (100 items)', () => {
    _.map(mediumObjArray, obj => obj.value * 2);
  })
);

// 2. _.filter benchmarks
suites.push(new Benchmark.Suite('_.filter')
  .add('filter - small array (10 items)', () => {
    _.filter(smallArray, x => x % 2 === 0);
  })
  .add('filter - medium array (100 items)', () => {
    _.filter(mediumArray, x => x % 2 === 0);
  })
  .add('filter - large array (1000 items)', () => {
    _.filter(largeArray, x => x % 2 === 0);
  })
  .add('filter - object array (100 items)', () => {
    _.filter(mediumObjArray, obj => obj.value > 50);
  })
);

// 3. _.reduce benchmarks
suites.push(new Benchmark.Suite('_.reduce')
  .add('reduce - small array (10 items)', () => {
    _.reduce(smallArray, (sum, x) => sum + x, 0);
  })
  .add('reduce - medium array (100 items)', () => {
    _.reduce(mediumArray, (sum, x) => sum + x, 0);
  })
  .add('reduce - large array (1000 items)', () => {
    _.reduce(largeArray, (sum, x) => sum + x, 0);
  })
);

// 4. _.get benchmarks
suites.push(new Benchmark.Suite('_.get')
  .add('get - single level', () => {
    _.get(nestedObject, 'a');
  })
  .add('get - two levels', () => {
    _.get(nestedObject, 'user.profile');
  })
  .add('get - deep path (5 levels)', () => {
    _.get(nestedObject, 'a.b.c.d.e');
  })
  .add('get - array path', () => {
    _.get(nestedObject, ['user', 'profile', 'name']);
  })
  .add('get - with default value', () => {
    _.get(nestedObject, 'nonexistent.path', 'default');
  })
);

// 5. _.set benchmarks
suites.push(new Benchmark.Suite('_.set')
  .add('set - single level', () => {
    _.set({}, 'key', 'value');
  })
  .add('set - deep path', () => {
    _.set({}, 'a.b.c.d', 'value');
  })
  .add('set - array path', () => {
    _.set({}, ['x', 'y', 'z'], 'value');
  })
);

// 6. _.cloneDeep benchmarks
suites.push(new Benchmark.Suite('_.cloneDeep')
  .add('cloneDeep - small object', () => {
    _.cloneDeep(smallObject);
  })
  .add('cloneDeep - nested object', () => {
    _.cloneDeep(nestedObject);
  })
  .add('cloneDeep - object array (100 items)', () => {
    _.cloneDeep(mediumObjArray);
  })
);

// 7. _.isEqual benchmarks
suites.push(new Benchmark.Suite('_.isEqual')
  .add('isEqual - primitives (equal)', () => {
    _.isEqual(42, 42);
  })
  .add('isEqual - primitives (not equal)', () => {
    _.isEqual(42, 43);
  })
  .add('isEqual - small arrays (equal)', () => {
    _.isEqual([1, 2, 3], [1, 2, 3]);
  })
  .add('isEqual - small objects (equal)', () => {
    _.isEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
  })
  .add('isEqual - nested objects', () => {
    _.isEqual(nestedObject, _.cloneDeep(nestedObject));
  })
);

// 8. _.forEach benchmarks
suites.push(new Benchmark.Suite('_.forEach')
  .add('forEach - small array (10 items)', () => {
    _.forEach(smallArray, x => x * 2);
  })
  .add('forEach - medium array (100 items)', () => {
    _.forEach(mediumArray, x => x * 2);
  })
  .add('forEach - large array (1000 items)', () => {
    _.forEach(largeArray, x => x * 2);
  })
);

// 9. _.find benchmarks
suites.push(new Benchmark.Suite('_.find')
  .add('find - small array', () => {
    _.find(smallArray, x => x === 5);
  })
  .add('find - medium array', () => {
    _.find(mediumArray, x => x === 50);
  })
  .add('find - object array', () => {
    _.find(mediumObjArray, obj => obj.id === 50);
  })
);

// 10. _.assign benchmarks
suites.push(new Benchmark.Suite('_.assign')
  .add('assign - small objects', () => {
    _.assign({}, { a: 1 }, { b: 2 }, { c: 3 });
  })
  .add('assign - medium objects', () => {
    _.assign({}, smallObject, { extra: 'value' });
  })
);

// 11. _.merge benchmarks
suites.push(new Benchmark.Suite('_.merge')
  .add('merge - shallow objects', () => {
    _.merge({}, { a: 1 }, { b: 2 });
  })
  .add('merge - nested objects', () => {
    _.merge({}, nestedObject, { a: { b: { c: 'new' } } });
  })
);

// 12. _.uniq benchmarks
suites.push(new Benchmark.Suite('_.uniq')
  .add('uniq - small array with duplicates', () => {
    _.uniq([1, 2, 2, 3, 3, 3, 4, 4, 5]);
  })
  .add('uniq - medium array', () => {
    _.uniq([...mediumArray, ...mediumArray]);
  })
);

// 13. _.sortBy benchmarks
suites.push(new Benchmark.Suite('_.sortBy')
  .add('sortBy - small array', () => {
    _.sortBy(smallArray.slice().reverse());
  })
  .add('sortBy - object array', () => {
    _.sortBy(smallObjArray, 'value');
  })
);

// 14. _.groupBy benchmarks
suites.push(new Benchmark.Suite('_.groupBy')
  .add('groupBy - by property', () => {
    _.groupBy(mediumObjArray, obj => Math.floor(obj.value / 10));
  })
);

// 15. _.keyBy benchmarks
suites.push(new Benchmark.Suite('_.keyBy')
  .add('keyBy - by id', () => {
    _.keyBy(mediumObjArray, 'id');
  })
);

// 16. _.pick benchmarks
suites.push(new Benchmark.Suite('_.pick')
  .add('pick - few keys', () => {
    _.pick(nestedObject, ['a', 'user']);
  })
  .add('pick - many keys', () => {
    _.pick(mediumObject, Object.keys(mediumObject).slice(0, 50));
  })
);

// 17. _.omit benchmarks
suites.push(new Benchmark.Suite('_.omit')
  .add('omit - few keys', () => {
    _.omit(nestedObject, ['a']);
  })
  .add('omit - many keys', () => {
    _.omit(mediumObject, Object.keys(mediumObject).slice(0, 50));
  })
);

// 18. _.debounce benchmarks
let debouncedFn = _.debounce(() => {}, 100);
suites.push(new Benchmark.Suite('_.debounce')
  .add('debounce - function creation', () => {
    _.debounce(() => {}, 100);
  })
  .add('debounce - function invocation', () => {
    debouncedFn();
  })
);

// 19. _.throttle benchmarks
let throttledFn = _.throttle(() => {}, 100);
suites.push(new Benchmark.Suite('_.throttle')
  .add('throttle - function creation', () => {
    _.throttle(() => {}, 100);
  })
  .add('throttle - function invocation', () => {
    throttledFn();
  })
);

// 20. _.chunk benchmarks
suites.push(new Benchmark.Suite('_.chunk')
  .add('chunk - small array', () => {
    _.chunk(smallArray, 2);
  })
  .add('chunk - medium array', () => {
    _.chunk(mediumArray, 10);
  })
);

// Run all benchmarks
console.log('='.repeat(80));
console.log('LODASH PERFORMANCE BENCHMARK SUITE');
console.log('='.repeat(80));
console.log('');

let currentSuite = 0;
const totalSuites = suites.length;

function runNextSuite() {
  if (currentSuite >= totalSuites) {
    console.log('');
    console.log('='.repeat(80));
    console.log('BENCHMARK COMPLETE');
    console.log('='.repeat(80));
    return;
  }

  const suite = suites[currentSuite];
  console.log(`[${currentSuite + 1}/${totalSuites}] Running: ${suite.name}`);
  console.log('-'.repeat(80));

  suite
    .on('cycle', event => {
      console.log('  ' + String(event.target));
    })
    .on('complete', function() {
      if (this.length > 1) {
        console.log('  Fastest: ' + this.filter('fastest').map('name'));
      }
      console.log('');
      currentSuite++;
      runNextSuite();
    })
    .run({ async: true });
}

runNextSuite();
