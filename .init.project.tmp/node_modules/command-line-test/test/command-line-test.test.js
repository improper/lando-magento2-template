'use strict';

var CliTest = require('..');

const pkg = require('../package');

describe('unit test', function() {

  it('constructor should be ok', function() {
    CliTest.should.be.ok();
  });

  it('exec method should be ok with yeild', function *() {
    const cliTest = new CliTest();
    var res = yield cliTest.exec('cat package.json');
    const _pkg = JSON.parse(res.stdout);
    pkg.name.should.be.equal(_pkg.name);
    cliTest.reset();
    res = yield cliTest.exec('cat README.md');
    res.stdout.should.containEql(_pkg.name);
  });

  it('exec method should be ok with promise', function(done) {
    const cliTest1 = new CliTest();
    cliTest1.exec('cat package.json').then(res => {
      const _pkg = JSON.parse(res.stdout);
      pkg.name.should.be.equal(_pkg.name);
      done();
    });
  });

  it('exec method should be ok with callback', function(done) {
    const cliTest1 = new CliTest();
    cliTest1.exec('cat package.json', function(err, res) {
      const _pkg = JSON.parse(res.stdout);
      pkg.name.should.be.equal(_pkg.name);
      done();
    });
  });
});
