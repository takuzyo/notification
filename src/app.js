const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
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