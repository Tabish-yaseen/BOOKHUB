const redis = require('ioredis')
const { promisify } = require("util")

const client = redis.createClient({
  host: 'localhost', 
  port: 6379, 
 
});
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)
const delAsync = promisify(client.del).bind(client)

client.on('error', function(error) {
  console.error(`Redis error: ${error}`)
});


module.exports = { getAsync, setAsync,delAsync }