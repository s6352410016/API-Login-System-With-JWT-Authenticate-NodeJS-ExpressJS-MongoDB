const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/Login_DB';

mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database...');
}).catch(err => {
    console.log(err);
})

const schema = new mongoose.Schema({
    fullname: {type: String , default: null},
    email: {type: String , unique: true},
    username: {type: String , default: null},
    password: {type: String , default: null},
    token: {type: String}
});

module.exports = mongoose.model('Users' , schema);