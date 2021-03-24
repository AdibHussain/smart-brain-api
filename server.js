const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profileGet = require('./controllers/profileGet');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true      
    }
  });


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('It is working') })

app.post('/signin', signIn.handleSignin(db, bcrypt))
app.post('/register',  register.handleRegister(db, bcrypt))
app.get('/profile/:id',  profileGet.handleProfileGet(db))
app.put('/image',  image.handleImage(db))
app.post('/imageurl', image.handleApiCall)

app.listen(process.env.PORT || 3000, ()=> {
  console.log('App is running on port ${process.env.PORT}');
})
