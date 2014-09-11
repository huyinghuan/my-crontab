_mysql = require './backup'

_config = require './mysql-config'

console.log _config

_mysql.doBackup(_config)