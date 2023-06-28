const http = require('http');
const crypto = require('crypto')
const fs = require('fs');

const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        const parsed = JSON.parse(data);
        let { username, password } = parsed;
        function encrypt(text) {
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update('cipher', 'utf-8', 'hex');
            encrypted += cipher.final('hex')
            return encrypted;
        }
        const algorithm = 'aes-256-cbc';      //algorithm for encrypt
        const key = crypto.randomBytes(32);   //key for encrypt
        const iv = crypto.randomBytes(16);    //iv for encrypt
        let encrypted = encrypt(password);    //call function encrypt 
        let oData = { username: username, password: encrypted };
        const oReadData = JSON.parse(fs.readFileSync('./Crypto/database.json', 'utf-8'));
        oReadData.aData.push(oData); //we have a aData arr in oReadData object form database.json
        let stringify = JSON.stringify(oReadData); 
        fs.writeFile('./Crypto/database.json', stringify, function (err) {
            if (err) console.log(err);
            console.log('saved');
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