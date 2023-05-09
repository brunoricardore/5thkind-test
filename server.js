const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/phone-simulator'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +
        '/dist/phone-simulator/index.html'));
});
app.listen(process.env.PORT || 8080);