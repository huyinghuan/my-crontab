// Generated by CoffeeScript 1.7.1
(function() {
  var BackupMysql, Log, doBackupFail, doBackupSuccess, generateBackupFilePath, getBackupDirectory, getExportSQL, _exec, _fs, _mkdirp, _moment, _path;

  _path = require('path');

  _fs = require('fs');

  _mkdirp = require('mkdirp');

  _moment = require('moment');

  Log = require('log4slow');

  _exec = require('child_process').exec;

  BackupMysql = module.exports = {};

  getBackupDirectory = function(dir) {
    if (dir == null) {
      dir = 'backup';
    }
    dir = _path.join(process.cwd(), dir);
    _mkdirp.sync(dir);
    return dir;
  };

  generateBackupFilePath = function(filePath) {
    var dir, nowTime;
    dir = getBackupDirectory(filePath);
    nowTime = _moment().format("YYYYMMDDHHmmss");
    return _path.join(dir, "" + nowTime + ".sql");
  };

  getExportSQL = function(connection, filename) {
    return "mysqldump --opt --host=" + connection.host + " --port=" + (connection.port || 3306) + " --user=" + connection.user + " --password=" + connection.password + " --database " + connection.database + " >> " + filename;
  };

  doBackupFail = function(error, filename) {
    if (_fs.existsSync(filename)) {
      _fs.unlinkSync(filename);
    }
    return Log.error("备份失败! " + error);
  };

  doBackupSuccess = function() {
    return Log.info("备份成功!");
  };

  BackupMysql.doBackup = function(options, cb) {
    var filename, shell;
    filename = generateBackupFilePath(options.save);
    shell = getExportSQL(options, filename);
    Log.info('doBackup', shell);
    return _exec(shell, function(err) {
      if (err) {
        return doBackupFail(err, filename);
      }
      doBackupSuccess();
      return cb && cb();
    });
  };

}).call(this);