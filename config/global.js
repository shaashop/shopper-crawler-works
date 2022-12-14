// global config
var config = new Map();

// mysql
config.set('type', 'dev');
config.set('domain', 'http://localhost:3000');
config.set('adminDomain', 'http://localhost:4000');
config.set('mysql', {
  host: '12.34.56.789',
  port: 3306,
  user: 'root',
  password: '123456789qwer',
  database: 'databasename',
  socketPath:
    'INSTANCE_CONNECTION_NAME:asia-northeast3:INSTANCE_CONNECTION_NAME',
});

// merge config from local.js
// if local.js is existed and local.js defines the configuration is used to local's, otherwise use global's
// like array_merge function in php
var fs = require('fs');
if (fs.existsSync(__dirname + '/local.js')) {
  // eslint-disable-next-line node/no-unpublished-require
  var customer = require('./local').customer;
  customer.forEach(function (value, key) {
    config.set(key, value);
  });
}

module.exports = config;
