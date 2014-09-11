_path = require 'path'
_fs = require 'fs'
_mkdirp = require 'mkdirp'
_moment = require 'moment'
Log = require 'log4slow'

_exec = require('child_process').exec

BackupMysql = module.exports = {}

#备份sql的目录
getBackupDirectory = (dir = 'backup')->
  dir = _path.join process.cwd(), dir
  _mkdirp.sync dir
  return dir

#生成备份文件路径
generateBackupFilePath = (filePath)->
  dir = getBackupDirectory(filePath)
  nowTime = _moment().format("YYYYMMDDHHmmss")
  _path.join dir, "#{nowTime}.sql"


#获取备份数据库sql
getExportSQL = (connection,  filename)->
  "mysqldump
        --opt
        --host=#{connection.host}
        --port=#{connection.port or 3306}
        --user=#{connection.user}
        --password=#{connection.password}
        --database #{connection.database}
        >> #{filename}"

doBackupFail = (error, filename)->
  _fs.unlinkSync filename if _fs.existsSync filename
  Log.error "备份失败! #{error}"

doBackupSuccess = ()->
  Log.info "备份成功!"


BackupMysql.doBackup = (options, cb)->
  filename = generateBackupFilePath options.save
  shell =  getExportSQL options, filename
  Log.info 'doBackup', shell
  _exec shell, (err)->
    return doBackupFail err, filename  if err
    doBackupSuccess()
    cb && cb()

