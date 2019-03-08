const mongoose = require('mongoose');

 mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false
}).then(() => {
    console.log("Connected to database.")
}).catch(() => {
    console.log('Unable to connect');
});




