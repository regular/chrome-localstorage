#!/usr/bin/env node
//const location = 'data/regular/.config/chromium/Default/Local Storage/leveldb'
const fs = require('fs')
const levelup = require('levelup')
const leveldown = require('leveldown')

const argv = require('minimist')(process.argv.slice(2))
console.dir(argv)

const defaultDB = process.env.HOME + '/.config/chromium/Default/Local Storage/leveldb'

if (!['read', 'write'].includes(argv._[0] || argv._.length < 3)) {
  console.error(`
Usage: ${process.argv[1]} read|write domain[:PORT] KEY [VALUE] [--db PATH-TO-LEVELDB] [--protocol PROTOCOL]

    PATH-TO-LEVELDB defaults to '${defaultDB}'
    PROTOCOL defaults to 'http://'
    
`)
  process.exit(1)
}

const [cmd, domain, key] = argv._
const dbpath = argv.db || defaultDB
const protocol = argv.protocol || "http://"

if (cmd == 'write') {
  const value = argv._[3]
  if (!value) {
    console.error('Need VALUE argument')
    process.exit(1)
  }
  const db = levelup(leveldown(dbpath), { })
  const k = Buffer.from("_"+ protocol +  domain + "\u0000\u0001" + key)
  const v = Buffer.from("\u0001" + value)
  db.put(k, v, (err, value) => {
    if (err) {
      return console.error(err)
      process.exit(2)
    }
  })
} else if (cmd == 'read') {
  const db = levelup(leveldown(dbpath), { })
  const k = Buffer.from("_"+ protocol +  domain + "\u0000\u0001" + key)
  db.get(k, (err, value) => {
    if (err) {
      return console.error(err)
      process.exit(2)
    }
    console.log(value.toString().slice(1))
  })

} else {
  console.error(`Unknown command: ${cmd}`)
  process.exit(3)
}


