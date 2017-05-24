'use strict'

const express = require('express')

const app = express()

app.use(express.static(__dirname))
app.use('/', express.static(__dirname + '/app'))

const REST_PORT = (process.env.PORT || 5000)

app.listen(REST_PORT, () => {
  console.log('App ready on port ' + REST_PORT)
})
