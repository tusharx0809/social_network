const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/friends', require('./routes/friend-request'));
app.use('/api/search-query', require('./routes/search'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/comments', require('./routes/comments&likes'));
app.use('/api/settings', require('./routes/accountsettings'));

app.listen(port, ()=>{
    console.log(`EventPlanner backend app is running on https://localhost:${port}`)
})