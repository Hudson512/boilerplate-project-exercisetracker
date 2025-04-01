const express = require('express')
const app = express()
const bodyParse = require('body-parser')
const cors = require('cors')
const req = require('express/lib/request')
require('dotenv').config()

app.use(cors())
app.use(bodyParse.urlencoded({extends: false}))
app.use(bodyParse.json())

app.use(express.static('public'))

let bd = [];

function visualizarBd(){
  console.log("============== BD =============")
  bd.map((obj, index)=>{console.log(`[${index}] -> username: ${obj.username}, _id: ${obj._id}`)})
  console.log("============== FIM BD =============")
}

function generateId() {
  const timestamp = Date.now().toString(16); // Converte o timestamp para hexadecimal
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomChars = '';
  
  for (let i = 0; i < 6; i++) {
      randomChars += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return timestamp + randomChars;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res)=> {
  let { username } = req.body;
  let _id = generateId();
  bd.push({username, _id});
  visualizarBd()
  res.send({username, _id});

})



app.get('/api/users', (req, res)=>{
  res.send(bd);
});


app.post('/api/users/:_id/exercises', (req, res)=>{
  const {description, duration, date} = req.body
  (date === undefined) ? date = new Date() : date = date  
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
