'use strict';

const childProcess = require('child_process');

var _getter = function() {
  return {
    error: this.error,
    stdout: this.stdout,
    stderr: this.stderr
  };
};

function CliTest(options) {
  this.options = options || {};
  this.reset();
}

CliTest.prototype.reset = function() {
  this.error = null;
  this.stdout = null;
  this.stderr = null;
};

CliTest.prototype.spawn = function() {
  var _args = Array.prototype.slice.call(arguments);
  const command = _args.shift();

  var args = [];
  var options = {};

  if (_args.length === 2) {
    args = _args.shift();
    options = _args.shift();
  } else if (_args.length === 1) {
    if (Array.isArray(_args[0])) {
      args = _args[0];
    } else {
      options = _args[0];
    }
  }

  return new Promise(resolve => {
    this.stdout = '';
    this.stderr = '';
    var child = childProcess.spawn(command, args, options);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.on('error', error => {
      this.error = error;
      resolve(_getter.call(this));
    });

    child.stdout.on('data', data => {
      this.stdout += data;
    });

    child.stderr.on('data', data => {
      this.stderr += data;
    });

    child.on('close', code => {
      if (code) {
        this.error = {
          code: code
        };
        return resolve(_getter.call(this));
      }
      resolve(_getter.call(this));
    });
  });
};

CliTest.prototype.fork = function() {
  var _args = Array.prototype.slice.call(arguments);
  const modulePath = _args.shift();
  var args = [];
  var options = {};

  if (_args.length === 2) {
    args = _args.shift();
    options = _args.shift();
  } else if (_args.length === 1) {
    if (Array.isArray(args[0])) {
      args = args[0];
    } else {
      options = args[0];
    }
  }

  return new Promise(resolve => {
    childProcess.fork(modulePath, args, Object.assign({
      maxBuffer: 1024 * 512 * 10,
      wrapArgs: false
    }, options), (error, stdout, stderr) => {
      if (error) {
        this.error = error;
        return resolve(_getter.call(this));
      }
      this.stderr = stderr.trim();
      this.stdout = stdout.trim();
      resolve(_getter.call(this));
    });
  });
};

CliTest.prototype.exec = function() {
  var args = Array.prototype.slice.call(arguments);
  const command = args.shift();
  var options = {};
  var callback = null;

  if (args.length === 2) {
    options = args.shift();
    callback = args.shift();
  } else if (args.length === 1) {
    if (typeof args[0] === 'function') {
      callback = args[0];
    } else {
      options = args[0];
    }
  }

  var promise = new Promise(resolve => {
    childProcess.exec(command, Object.assign({
      maxBuffer: 1024 * 512 * 10,
      wrapArgs: false
    }, options), (error, stdout, stderr) => {
      if (error) {
        this.error = error;
        return resolve(_getter.call(this));
      }
      this.stderr = stderr.trim();
      this.stdout = stdout.trim();
      resolve(_getter.call(this));
    });
  });

  if (callback) {
    promise.then(data => {
      callback.call(this, null, data);
    }).catch(err => {
      callback.call(this, `exec ${command} error with: ${err}`);
    });
  } else {
    return promise;
  }
};

CliTest.prototype.execFile = function() {
  var _args = Array.prototype.slice.call(arguments);
  const file = _args.shift();
  const args = _args.shift();
  const options = _args.shift();

  const callback = _args[0] ? _args[0] : null;

  var promise = new Promise(resolve => {
    childProcess.execFile(file, args, Object.assign({
      maxBuffer: 1024 * 512 * 10,
      wrapArgs: false
    }, options), (error, stdout, stderr) => {
      if (error) {
        this.error = error;
        return resolve(_getter.call(this));
      }
      this.stderr = stderr.trim();
      this.stdout = stdout.trim();
      resolve(_getter.call(this));
    });
  });

  if (callback) {
    promise.then(data => {
      callback.call(this, null, data);
    }).catch(err => {
      callback.call(this, `execFile ${file} error with: ${err}`);
    });
  } else {
    return promise;
  }
};

module.exports = CliTest;
