import express from 'express'
import path from 'path'
// import index from './routes/index'
import about from './routes/about'
// import onUpload from './routes/upload'

let app = express()
const PORT = process.env.PORT || 3000;

const onUpload = (req, res) => {
  res.send({express: 'YOOOOOOOO THIS IS CONNECTING'})
  // const form = new multiparty.Form()
}

app.get("/", onUpload)

app.listen(PORT, () => {
  console.log(`FaceMe app is listening on port ${PORT}`)
})

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/public/index.html'));
// });

// app.use('/', index)

// app.use('/about', about)
