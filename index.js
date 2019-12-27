const https = require('https')
const mqtt = require('mqtt')
const iconMap = require('./icons')
const lametricData = require('./lametric.json')

const accessToken = process.env.ACCESS_TOKEN
const appPath = process.env.APP_PATH

var previousColour = ''
var client = mqtt.connect('mqtt://mqtt.cheerlights.com')

client.on('connect', function () {
  client.subscribe('cheerlights', function (err) {
    if (!err) {
      console.log('Connected')
    }
  })
})
 
client.on('message', function (topic, message) {
  var nextColour = message.toString()
  console.log(nextColour)

  if (iconMap.hasOwnProperty(nextColour) && nextColour != previousColour) {
    previousColour = nextColour
    
    lametricData.frames[0].text = nextColour
    lametricData.frames[0].icon = iconMap[nextColour]

    updateLaMetricIndicator(JSON.stringify(lametricData))
  }
})

function updateLaMetricIndicator(data) {
  console.log(data)

  const options = {
    hostname: 'developer.lametric.com',
    port: 443,
    path: appPath,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'X-Access-Token': accessToken
    }
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
}
