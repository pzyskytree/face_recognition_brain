const express =  require("express");
const bodyParser = require("body-parser");
const bcrypt =  require("bcrypt-nodejs");
const cors = require("cors");
const db = require("knex")({
    client: "pg",
    connection:{
        host:"127.0.0.1",
        port:"5433",
        user:"postgres",
        password:"admin",
        database:"smart-brain"
    }
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.get("/", (req, res) => {
    db.select('*').from("users")
            .then(data => {
                return res.json(data);
            });
});

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfile(db));
app.put("/image", image.handleImage(db));
app.post("/imageUrl", image.handleApiCall());

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
