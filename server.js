if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'./node_modules/.env'})
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const fs = require('fs')
const fileName = './list.json';
const file = require(fileName);

file.username = "new value";


var likedList = []
var listObj = {
    "id": 1,
    "username": "connor",
    "email": "connor@gmail.com",
    "liked": []
}



const initializePassport = require('./passport-config')
const Console = require("console");
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

var users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/views'));
app.use(methodOverride('_method'))


fs.readFile('list.json', 'utf8', function readFileCallback(err,data ){
    if(err){
        //console.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
        //throw err;
    }
    else{
            var i = likedList.length + 1
        //parse JSON data into object array
        var rawdata = fs.readFileSync('list.json');
        var student = JSON.parse(rawdata);
        users = student;
            //console.log(likedList[i].email)
    }
});



app.get('/', (req,res) =>{
    res.render('.ejs', { name: req.user.name })
})

app.get('/login', (req,res) =>{
    res.render('login.ejs')
})
app.get('/search', (req,res) =>{
    res.render('search.ejs')
})
app.get('/list', (req,res) =>{
    res.render('list.ejs')
})
app.get('/register', (req,res) =>{
    res.render('register.ejs')
})
app.get('/scripts.js', function(req, res) {
    res.sendFile(__dirname + '/scripts.js');
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/search.ejs');
});

app.get('/like', function(req, res) {
    console.log(req.body)
    res.sendStatus(200)

});
app.post('/login',  passport.authenticate('local', {
    successRedirect: '/search',
    failureRedirect: '/login',
    failureFlash: true
}))
app.post('/search', async (req, res) => {
    res.render('/list')
})
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword

        })


        console.log(listObj)

        fs.writeFile(fileName, JSON.stringify(users, null, 2), function writeJSON(err) {
            if (err) return console.log(err);

            //console.log(JSON.stringify(file));
            //console.log('writing to ' + fileName);
        });
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
        console.log(users)
})

app.listen(3000)