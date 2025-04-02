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


app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (!description || !duration || !_id) {
    return res.send('Campo vazio');
  }

  const exerciseDate = date ? new Date(date).toDateString() : new Date().toDateString();

  let user = bd.find(user => user._id === _id);
  
  if (!user) {
    return res.send('Usuario não encontrado');
  }

  if (!user.exercises) {
    user.exercises = [];
  }

  const exercise = {
    description,
    duration: Number(duration),
    date: exerciseDate
  };

  user.exercises.push(exercise);

  return res.json({
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  });
});


app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = bd.find(user => user._id === _id);
  if (!user) {
    return res.send('Usuario não encontrado');
  }

  let exercises = user.exercises || [];

  if (from || to) {
    const fromDate = from ? new Date(from) : new Date(0);
    const toDate = to ? new Date(to) : new Date();

    exercises = exercises.filter(exercise => {
      const exerciseDate = new Date(exercise.date);
      return exerciseDate >= fromDate && exerciseDate <= toDate;
    });
  }

  if (limit) {
    exercises = exercises.slice(0, parseInt(limit));
  }

  const formattedExercises = exercises.map(exercise => ({
    description: String(exercise.description),
    duration: Number(exercise.duration),
    date: new Date(exercise.date).toDateString()
  }));

  return res.json({
    _id: user._id,
    username: user.username,
    count: exercises.length,
    log: formattedExercises
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
