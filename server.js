import express from 'express'
import path from 'path'
// import index from './routes/index'
import about from './routes/about'

let app = express()

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// app.use('/', index)

// app.use('/about', about)

app.listen(3000, () => {
  console.log('FaceMe app is listening on port 3000!')
})
