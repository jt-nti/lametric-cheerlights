const mqtt = require('mqtt')
const LaMetricCloud = require('lametric-cloud')

const frames = require('./frames')

const accessToken = process.env.ACCESS_TOKEN
const widgetId = process.env.WIDGET_ID

var previousColour = ''
var mqttClient = mqtt.connect('mqtt://mqtt.cheerlights.com')

const laMetricClient = new LaMetricCloud({
  access_token: accessToken
});

mqttClient.on('connect', function () {
  mqttClient.subscribe('cheerlights', function (err) {
    if (!err) {
      console.log('Connected')
    }
  })
})
 
mqttClient.on('message', function (topic, message) {
  var nextColour = message.toString()
  console.log(nextColour)

  if (frames.hasOwnProperty(nextColour) && nextColour != previousColour) {
    previousColour = nextColour

    const frame = frames[nextColour]
    console.log(JSON.stringify(frame, null, 2))

    laMetricClient.updateWidget(widgetId, [ frame ], 1)
      .then(console.log('updated'))
      .catch(console.error)
  }
})
