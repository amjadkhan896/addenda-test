const express     = require('express')
var bodyParser=require("body-parser");
var cors = require('cors')
const dotenv = require('dotenv');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

require('./src/db/mongoose');


const app   = express();
dotenv.config();


app.use(cors());


const userRoutes = require('./src/routes/user')
const PostRoutes = require('./src/routes/post')
const IndexRoutes = require('./src/routes/index')


app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use(express.static(__dirname + "/src/public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

const port  =  process.env.PORT || 8026

app.use(express.json())

app.use(userRoutes)
app.use(PostRoutes)
app.use(IndexRoutes)




app.listen(port,() =>{
    console.log('server is up on ' + port);
})