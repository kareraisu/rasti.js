'use strict'

const express = require('express')

const app = express()

app.use('/', express.static(__dirname + '/example'))
app.use('/lib', express.static(__dirname + '/lib'))
app.use('/dist', express.static(__dirname + '/dist'))

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

const REST_PORT = (process.env.PORT || 5000)

app.listen(REST_PORT, () => {
  console.log('App ready on port ' + REST_PORT)
})
