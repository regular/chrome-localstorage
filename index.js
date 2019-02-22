const fs = require('fs')
const levelup = require('levelup')
const leveldown = require('leveldown')

function getOpts(opts) {
  const defaultDB = process.env.HOME + '/.config/chromium/Default/Local Storage/leveldb'

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
