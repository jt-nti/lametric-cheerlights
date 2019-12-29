const mqtt = require('mqtt')
const LaMetricCloud = require('lametric-cloud')

const iconMap = require('./icons')

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

  if (iconMap.hasOwnProperty(nextColour) && nextColour != previousColour) {
    previousColour = nextColour

    const frames = [
      {
        text: nextColour,
        icon: iconMap[nextColour],
        index: 0
      }
    ]

    laMetricClient.updateWidget(widgetId, frames, 1)
      .then(console.log('updated'))
      .catch(console.error)
  }
})
