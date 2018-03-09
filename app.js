const express = require('express')
const index = require('./routes/index')

let app = express()

app.get('/', function (req, res) {
  res.send('Hello Bozo!');
});

app.use('/index', index)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', )

app.listen(3000, () => {
  console.log('FaceMe app is listening on port 3000!')
})
