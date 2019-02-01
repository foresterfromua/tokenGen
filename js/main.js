const Web3 = require('web3');
const rpcURL = "https://ropsten.infura.io/v3/8a3f1129d8bd4c56958634d954f1f686";
const web3 = new Web3(rpcURL);
const base64url = require('base64url');

document.querySelector(".btn").addEventListener("click", generateToken);

function getTimestamp() {
	return (Date.now() / 1000) + 2629800; 
}

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

function generateToken() {
	const publicKey = document.querySelector('.public').value;
	const secret = document.querySelector('.secret').value;
	const idData = {
		"createdBy": publicKey,
		"validUntil": getTimestamp()
	}
  let data = encode(preparePayload(secret, idData));
  console.log(data);
	document.querySelector('.result').innerHTML = data;
}

