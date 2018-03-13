import express from 'express'
import index from './routes/index'
import about from './routes/about'

let app = express()

// app.get('/', function (req, res) {
//   res.send('Hello Bozo!');
// });

app.use('/', index)

app.use('/about', about)

app.listen(3000, () => {
  console.log('FaceMe app is listening on port 3000!')
})
