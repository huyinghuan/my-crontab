// Generated by CoffeeScript 1.7.1
(function() {
  var _config, _mysql;

  _mysql = require('./backup');

  _config = require('./mysql-config');

  console.log(_config);

  _mysql.doBackup(_config);

}).call(this);