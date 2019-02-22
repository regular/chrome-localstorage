const fs = require('fs')
const path = require('path')
const os = require('os')
const levelup = require('levelup')
const leveldown = require('leveldown')

const prefix = {
  linux: '.config/chromium',
  darwin: 'Library/Application Support/Chromium'
}[os.platform()]
const defaultDB = path.join(process.env.HOME, prefix,  'Default/Local Storage/leveldb')

function getOpts(opts) {
  const dbpath = opts.db || defaultDB
  const protocol = opts.protocol || "http://"
  return {dbpath, protocol}
}

function write(domain, key, value, opts, cb) {
  if (!value) {
    return cb(new Error('Need VALUE argument'))
  }
  const {dbpath, protocol} = getOpts(opts)
  const db = levelup(leveldown(dbpath), { })
  const k = Buffer.from("_"+ protocol +  domain + "\u0000\u0001" + key)
  const v = Buffer.from("\u0001" + value)
  db.put(k, v, cb)
} 

function read(domain, key, opts, cb) {
  const {dbpath, protocol} = getOpts(opts)

  const db = levelup(leveldown(dbpath), { })
  const k = Buffer.from("_"+ protocol +  domain + "\u0000\u0001" + key)
  db.get(k, (err, value)=>{
    if (err) return cb(err)
    return cb(null, value.toString().slice(1))
  })
}

module.exports = {
  read, write, getOpts
}
