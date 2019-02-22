#!/usr/bin/env node
const {read, write, getOpts} = require('.')

const argv = require('minimist')(process.argv.slice(2))
//console.dir(argv)

if (!['read', 'write'].includes(argv._[0] || argv._.length < 3)) {
  console.error(`
Usage: ${process.argv[1]} read|write DOMAIN[:PORT] KEY [VALUE] [--db PATH-TO-LEVELDB] [--protocol PROTOCOL]

    PATH-TO-LEVELDB defaults to '${getOpts({}).dbpath}'
    PROTOCOL defaults to '${getOpts({}).protocol}'
    
`)
  process.exit(1)
}

const [cmd, domain, key] = argv._

if (cmd == 'write') {
  const value = argv._[3]
  write(domain, key, value, argv, err => {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
  })
} else if (cmd == 'read') {
  read(domain, key, argv, (err, value) => {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
    console.log(value)
  })
}

