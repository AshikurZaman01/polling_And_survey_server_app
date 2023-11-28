const express = require('express');
const app = express();
const cors = require('cors');
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Poll server is running')
})

app.listen(port, () => {
    console.log(`Poll running  on port ${port}`);
})