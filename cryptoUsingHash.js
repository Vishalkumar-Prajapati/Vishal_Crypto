const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        const parsed = JSON.parse(data);
        let { username, password } = parsed;
        const key = 'vishal';
        let encrypted = crypto.createHmac('sha256', key).update(password).digest('hex');
        let oData = { username: username, password: encrypted };
        const readData = JSON.parse(fs.readFileSync('./Crypto/database.json', 'utf-8'));
        readData.database.push(oData); 
        let stringify = JSON.stringify(readData);
        fs.writeFile('./Crypto/database.json', stringify, function (err) {
            if (err) console.log(err);
            console.log('seved');
        });
        return res.end(stringify);
    });
});
server.listen(8080, (err) => {
    if (err) console.log(err);
    else {
        console.log('listening on port no 8080');
    }
});
