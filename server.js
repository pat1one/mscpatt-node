const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

const USER = { username: 'admin', password: '1234' };

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.auth = true;
    res.redirect('/dashboard');
  } else {
    res.send('Неверные данные');
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.auth) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.post('/upload', upload.single('avatar'), (req, res) => {
  if (!req.session.auth) return res.redirect('/login');
  const targetPath = path.join(__dirname, 'uploads/avatar.jpg');
  fs.rename(req.file.path, targetPath, (err) => {
    if (err) console.error(err);
    res.redirect('/dashboard');
  });
});

app.post('/contact', (req, res) => {
  console.log('Сообщение от:', req.body);
  res.send('Сообщение отправлено!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
