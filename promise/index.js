
// learning about promise

// utils
var asyncCall = function (fn) {
  setTimeout(fn, 0)
}

var isFunction = function (v) {
  return v && typeof v === 'function'
}

var isObject = function (v) {
  return v && typeof v === 'object'
}

// 1. Terminology
// 1.1 “promise” is an object or function with a then method whose behavior conforms to this specification.
// 1.2 “thenable” is an object or function that defines a then method.
// 1.3 “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
// 1.4 “exception” is a value that is thrown using the throw statement.
// 1.5 “reason” is a value that indicates why a promise was rejected.

// 2.1 Promise States
// A promise must be in one of three states: pending, fulfilled, or rejected.
var States = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
}
var changeState = function (state, value) {
  // 2.1.1 When pending, a promise
  // 2.1.1.1 may transition to either the fulfilled or rejected state.
  var isPendign = this.state === States.PENDING
  // 2.1.2 When fulfilled, a promise
  // 2.1.2.1 must not transition to any other state.
  var isFulfilled = this.state === States.FULFILLED
  // 2.1.3 When rejected, a promise
  // 2.1.3.1 must not transition to any other state.
  var isRejected = this.state === state.REJECTED

  if (!isPendign || isFulfilled || isRejected) {
    throw new Error('could not change state')
  }
  // 2.1.2.2 && 2.1.3.2 must have a value, which must not change
  this.value = value
  this.state = state
  this.nextTick()
}

// 2.2 The then Method
// A promise must provide a then method to access its current or eventual value or reason.
// A promise’s then method accepts two arguments:
// promise.then(onFulfilled, onRejected)
var then = function (onFulfilled, onRejected) {
  var promise = new Promise()
  var cache = {}
  cache.promise = promise
  // 2.2.1 Both onFulfilled and onRejected are optional arguments:
  // 2.2.1.1 If onFulfilled is not a function, it must be ignored.
  if (isFunction(onFulfilled)) {
    cache.fulfill = onFulfilled
  }
  // 2.2.1.2 If onRejected is not a function, it must be ignored.
  if (isFunction(onRejected)) {
    cache.reject = onRejected
  }
  this.queue.push(cache)
  this.nextTick()
  // 2.2.7 then must return a promise
  return promise
}

var nextTick = function () {
  var _this = this
  if (this.state === States.PENDING) {
    return 
  }
  asyncCall(function () {
    // 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
    while (_this.queue.length) {
      // 2.2.6 then may be called multiple times on the same promise.
      var task = _this.queue.shift()
      var handler = null
      var value = null

      if (_this.state === States.FULFILLED) {
        // 2.2.6.1 If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then
        handler = task.fulfill
      } else if (_this.state === States.REJECTED) {
        // 2.2.6.2 If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.
        handler = task.reject
      }

      try {
        // 2.2.5 onFulfilled and onRejected must be called as functions (i.e. with no this value).
        value = handler ? handler(_this.value) : value
      } catch (e) {
        // 2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
        task.promise.changeState(States.REJECTED, e)
        continue;
      }
      // 2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x)
      // 2.2.7.3 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1
      // 2.2.7.4 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1
      Resolve(task.promise, value)
    }
  })
}

// 2.3 The Promise Resolution Procedure
var Resolve = function (promise, x) {
  if (promise === x) {
    // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
    promise.changeState(States.REJECTED, new TypeError("The promise and its value refer to the same object"));
  } else if (x && x.constructor === Promise) {
    // 2.3.2 If x is a promise, adopt its state
    if (x.state === States.PENDING) {
      // 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected
      x.then(function (value) {
        Resolve(promise, value)
      }, function (reason) {
        promise.changeState(States.REJECTED, reason)
      })
    } else {
      // 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
      // 2.3.2.3 If/when x is rejected, reject promise with the same reason.
      promise.changeState(x.state, x.value)
    }
  } else if (isObject(x) || isFunction(x)) {
    // 2.3.3 Otherwise, if x is an object or function
    // 2.3.3.1 Let then be x.then.
    var called = false
    try {
      var thenFunc = x.then
      if (isFunction(thenFunc)) {
        // 2.3.3.3 If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise
        thenFunc.call(x, function (v) {
          // 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)
          // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
          if (!called) {
            Resolve(promise, v)
            called = true
          }
        }, function (v) {
          // 2.3.3.3.2 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)
          // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
          if (!called) {
            promise.reject(v)
            called = true
          }
        })
      } else {
        // 2.3.3.4 If then is not a function, fulfill promise with x
        promise.resolve(x)
        called = true
      }
    } catch (e) {
      // 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
      // 2.3.3.3.4 If calling then throws an exception e
      if (!called) {
        // 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
        // 2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
        promise.reject(e);
        called = true;
      }
    }
  } else {
    // 2.3.4 If x is not an object or function, fulfill promise with x
    promise.resolve(x);
  } 
}

var resolve = function (value) {
  this.changeState(States.FULFILLED, value)
}

var reject = function (reason) {
  this.changeState(States.REJECTED, reason)
}



function Promise (fn) {
  var _this = this
  this.value = null
  this.queue = []
  this.state = States.PENDING
  if (isFunction(fn)) {
    fn(function (value) {
      Resolve(_this, value)
    }, function (reason) {
      _this.reject(reason)
    })
  } 
}

Promise.prototype.changeState = changeState
Promise.prototype.nextTick = nextTick
Promise.prototype.then = then
Promise.prototype.resolve = resolve
Promise.prototype.reject = reject

// test example
var a = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('abc')
  }, 2000)
})

a.then(function (v) {
  console.log(v)
  return v
}).then(function (v) {
  console.log(v)
  console.log('def')
})
