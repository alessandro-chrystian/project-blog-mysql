const mysql = require('mysql2')
const express = require("express");
const lodash = require('lodash');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog_db'
})

db.connect((err) => {
  if (err) console.log(err)
    console.log('Conectado ao banco de dados!')
})


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"));

app.get('/',  (req, res) => {
  const query = "SELECT * from posts"

  db.query(query, (err, results) => {
    if(err) {
      console.log(err)
      res.status(500).send('Erro na aplicação')
      return
    } else {
      res.render('home', {homeStartingContent: homeStartingContent, posts: results})
    }
  })
})

app.get('/publicar', (req, res) => {
  res.render('publish', {error: false})
})

app.post('/publicar',  (req, res) => {
  const title = req.body.postTitle
  const description = req.body.postBody

  if(title && description) {
    const query = "INSERT INTO posts (title, description) VALUES (?, ?)"

    db.query(query, [title, description], (err) => {
      if(err) {
        res.status(500).send('Erro na aplicação')
        console.log(err)
        return
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.render('publish', {error: 'Dados não inseridos'})
  }
})

app.get('/post/:postName', (req, res) => {
  const query = 'SELECT * FROM posts WHERE title = ?'
  const requestedTitle = req.params.postName

  db.query(query, [requestedTitle], (err, results) => {
    if(err) {
      console.log(err)
      res.status(404).send('Erro na aplicação')
      return
    } else {
      const post = results[0]

      res.render('post', {title: post.title, description: post.description})
    }
  })
})

app.listen(4000, function() {
  console.log("Server started on port 4000");
});