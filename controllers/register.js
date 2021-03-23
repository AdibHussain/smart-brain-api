const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    if(!email || !firstName || !lastName || !password) {
        return res.status(400).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return db('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          firstname: firstName,
          lastname: lastName,
          joined: new Date()
        }).then(user => {
          res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register.'))
    }

    module.exports = {
        handleRegister
    };