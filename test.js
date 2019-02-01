const Web3 = require('web3');
const fs = require('fs');
const rpcURL = "https://ropsten.infura.io/v3/8a3f1129d8bd4c56958634d954f1f686";
const web3 = new Web3(rpcURL);
const base64url = require('base64url');

function encode(data) {
    return base64url(serializeForHashing(data));
}

function serializeForHashing(object) {
    const isDict = (subject) => typeof subject === 'object' && !Array.isArray(subject);
    const isString = (subject) => typeof subject === 'string';
    const isArray = (subject) => Array.isArray(subject);

    if (isDict(object)) {
      const content = Object
        .keys(object)
        .sort()
        .map((key) => `"${key}":${serializeForHashing(object[key])}`)
        .join(',');
      return `{${content}}`;
    } else if (isArray(object)) {
      const content = object.map((item) => serializeForHashing(item)).join(',');
      return `[${content}]`;
    } else if (isString(object)) {
      return `"${object}"`;
    }
    return object.toString();
}

function sign(privateKey, data) {
    const {signature} = web3.eth.accounts.sign(serializeForHashing(data), privateKey);
    return signature;
}


function preparePayload(secret, idData) {
    const signature = sign(secret, idData);
    const payload = {signature, idData};
    return payload;
}

const secret = '0xe15b1f0860c8e9174309e892d980a8a7d4572a0f569300fcb4e306065e58fcb2';
const idData = {
    "createdBy": "0xfFBFe058944Cc9D5cD106ba7cAa17781B8b31fa7",
    "validUntil": 1746300800
}

const data = encode(preparePayload(secret, idData));

fs.writeFile('temp.txt', data, function(err, data){
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});


