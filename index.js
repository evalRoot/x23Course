
require('dotenv').config()
const express = require('express')
const app = express()
const sequelize = require('./db')
const port = 5000
const router = require('./api')
const cors = require('cors')
const { createDefaultValues } = require('./defaultValues')

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use('/api', router)

app.get('/api/test', (req, res) => {
  return res.status(200).json({message: 'test'})
})

const start = async () => {
  try {
      await sequelize.authenticate()
      await sequelize.sync()
      app.listen(port, async () => {
        await createDefaultValues()
        console.log(`Server started on port ${port}`)
      })
  } catch (error) {
      console.log('---')
      console.log(error, 'start server error')
      console.log('---')
  }
}


start()
