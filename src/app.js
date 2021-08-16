const app = require("express")();
const express = require("express");
const session = require("express-session")
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const passport = require('./auth');
const mustacheExpress = require('mustache-express');
const flash = require('connect-flash');

app.engine('mst', mustacheExpress());
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(flash());
app.use(session({
    secret: 'YOUR-SECRET-STRING',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const authMiddleware = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect(302, '/login');
    }
};

const manageMiddleware = (req, res, next) => {
    console.log(req.user);
    if(req.isAuthenticated() && req.user.role === 'manager') {
        next();
    }else{
        res.redirect(302, '/login');
    }
};

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/notify", manageMiddleware, (req, res)=>{
    res.sendFile(__dirname + "/notify.html");
});

app.get("/login", (req, res)=>{
    const errorMessage = req.flash('error').join('<br>');
    res.render('login/form', {
        errorMessage: errorMessage
    });
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/login',
        failureFlash: true,
        badRequestMessage: '「メールアドレス」と「パスワード」は必須です。'
    })
);

app.get('/logout', (res, req) => {
    req.logout();
    res.redirect('/login');
})

app.get('/user', authMiddleware, (req, res) => {
    const user = req.user;
    res.send('ログイン完了');
});

io.on("connection", (socket)=>{
    console.log("ユーザが接続しました");

    socket.on("post", (msg)=>{
        io.emit("member-post", msg);
    });
});

http.listen(80, ()=>{
    console.log("start server");
})