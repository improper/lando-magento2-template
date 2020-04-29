/*
 * This file was automatically generated, editing it manually would be foolish
 *
 * See https://github.com/lando/leia for more
 * information on how all this magic works
 *
 * id: getting-started-with-magento-2-lando
 * runs-from: ../..
 */

// Set some helpful envvars so we know these are leia tezts
process.env.LEIA_PARSER_RUNNING = 'true';
process.env.LEIA_PARSER_VERSION = '0.3.4';
process.env.LEIA_PARSER_ID = 'getting-started-with-magento-2-lando';
process.env.LEIA_PARSER_RETRY = 3;

// We need these deps to run our tezts
const chai = require('chai');
const CliTest = require('command-line-test');
const path = require('path');
chai.should();

/* eslint-disable max-len */

describe('getting-started-with-magento-2-lando', function() {
  this.retries(3);

  // These tests are the main event
  // @todo: It would be nice to eventually get these into mocha after hooks
  // so they run after every test
  it('clone and access this repository', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('git clone git@github.com:improper/lando-magento2-template.git && cd lando-magento2-template').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  it('review magento download options', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('cd lando-magento2-template && lando --help magento:download').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  it('download magento drop arguments for interactive mode', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('cd lando-magento2-template && lando magento:download --mage-edition "Open Source" \ &&     --mage-version 2.3 \ &&     --mage-access-key-private $MAGE_PRIVATE_KEY \ &&     --mage-access-key-public $MAGE_PUBLIC_KEY \ &&     --github-token $MY_GITHUB_TOKEN \ &&     --notify-magento false \ &&     --notify-github false').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  it('your auth json has automatically been generated', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('cd lando-magento2-template && cat auth.json').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  it('deploy mangento with configured database', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('cd lando-magento2-template && lando start && lando composer install && lando magento:setup:quick ').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  it('confirm store is accessible via bash', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('curl -I -k --fail -s https://magento2.lndo.site/home | grep 200 && echo "Good to go."').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  it('review additional magento tooling', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('cd lando-magento2-template && lando --help magento:setup:destroy && lando --help magento:setup:quick').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });

  // These are tests we need to run to get the app into a state to test
  // @todo: It would be nice to eventually get these into mocha before hooks
  // so they run before every test
  it('jump into repo directory', done => {
    process.chdir(path.resolve(__dirname, '../..'));
    const cli = new CliTest();
    cli.exec('cd lando-magento2-template && lando destroy -y && rm -r lando-magento2-template').then(res => {
      if (res.error === null) {
        done();
      } else {
        done(res.error);
      }
    });
  });
});
