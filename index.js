const express     = require('express')
var bodyParser=require("body-parser");
const cookieParser = require('cookie-parser');
var cors = require('cors')
const dotenv = require('dotenv');



require('./src/db/mongoose');


const app   = express();
app.use(cookieParser());

dotenv.config();


app.use(cors());


const userRoutes = require('./src/routes/user')
const ContactRoutes = require('./src/routes/contact')
const IndexRoutes = require('./src/routes/index')


app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use(express.static(__dirname + "/src/public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json())
app.use(userRoutes)
app.use(ContactRoutes)
app.use(IndexRoutes)


const port  =  process.env.PORT || 8026


app.listen(port,() =>{
    console.log('server is up on ' + port);
})