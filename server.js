import express from 'express'
import path from 'path'
import index from './routes/index'
import about from './routes/about'
import upload from './routes/upload'

const PORT = process.env.PORT || 8080;
let app = express()


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/', index)
app.use('/about', about)
app.use('/upload', upload)

app.listen(PORT, () => {
  console.log(`FaceMe app is listening on port ${PORT}`)
})
