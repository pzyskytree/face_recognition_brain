const express =  require("express");
const bodyParser = require("body-parser");
const bcrypt =  require("bcrypt-nodejs");
const cors = require("cors");
const app = express();
app.use(bodyParser.json())
app.use(cors())

const database = {
    users: [
        {
            id: "123",
            name: "John",
            password: "cookies",
            email: "john@gmail.com",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            password: "bananas",
            email: "sally@gmail.com",
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
});

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password == database.users[0].password) {
        res.json(database.users[0]);
    }else{
        res.status(400).json("error logging in");
    }
});

app.post("/register", (req, res) =>{
    const {email, name, password} = req.body;
    database.users.push({
        id: "125",
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id)
            res.json(user);
    });
    res.status(404).json("Not Found");
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    database.users.forEach(user => {
        if (user.id === id)
            res.json(++user.entries);
    });
    res.status(404).json("Not Found");
});

app.listen(3001, () => {
    console.log("app is running on port 3001");
});