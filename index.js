const express = require('express');
const path = require('path');
const router = require('./routes/router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs');

app.use(router);

app.listen(3000 , () => {
    console.log('Start server...');
})