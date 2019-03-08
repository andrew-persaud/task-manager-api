const express = require('express'); //Load express
const Task = require('./models/task.js');
const User = require('./models/user.js');
require('./db/mongoose.js');
const routerUser = require('./routers/user.js');
const routerTask = require('./routers/task.js');
const multer = require('multer');

//init express
const app = express()
const port = process.env.PORT;

 
app.use(express.json()); //Tell express to parse json to an object
app.use(routerUser);
app.use(routerTask);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});





