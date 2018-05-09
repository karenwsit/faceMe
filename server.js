import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import index from './routes/index'
import about from './routes/about'
import upload from './routes/upload'
import s3handler from './routes/s3handler'
import fbi from './routes/fbi'

const PORT = process.env.PORT || 8080;
let app = express()

app.use('/', index)
app.use('/about', about)
app.use('/upload', upload)
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use('/s3handler', s3handler)

app.listen(PORT, () => {
  console.log(`FaceMe app is listening on port ${PORT}`)
})
