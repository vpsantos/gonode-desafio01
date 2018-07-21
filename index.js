const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

const dataMiddleware = (req, res, next) => {
  if (req.query.name && req.query.age) {
    next();
  } else {
    res.redirect('/');
  }
};

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { name, dateOfBirth } = req.body;
  const age = dateOfBirth ? moment().diff(moment(dateOfBirth, 'DD/MM/YYYY'), 'years') : '';

  if (age >= 18) {
    res.redirect(`/major?name=${name}&age=${age}`);
  } else {
    res.redirect(`/minor?name=${name}&age=${age}`);
  }
});

app.get('/major', dataMiddleware, (req, res) => {
  res.render('major', { name: req.query.name });
});

app.get('/minor', dataMiddleware, (req, res) => {
  res.render('minor', { name: req.query.name });
});

app.listen(3000);
