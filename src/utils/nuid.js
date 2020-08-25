import fetch from 'node-fetch';

const apiRootUrl = 'https://auth.nuid.io';
const apiKey = process.env.NUID_API_KEY;
const createCredentials = (verifiable) => {
  const body = JSON.stringify({
    'nuid.credential/verified': verifiable
  });

  const opts = {
    method: 'POST',
    headers: getHeaders(),
    body: body
  };

  return fetch(`${apiRootUrl}/credential`, opts).then(res => res.json());
}

const getCredentails = (id) => {
  const opts = {
    method: 'GET',
    headers: getHeaders()
  };

  return fetch(`${apiRootUrl}/credential/${id}`, opts).then(res => res.json());
}

const challengeCredentials = (credential) =>  {
  const body = JSON.stringify({
    'nuid/credential': credential
  });

  const opts = {
    method: 'POST',
    headers: getHeaders(),
    body: body
  };

  return fetch(`${apiRootUrl}/challenge`, opts).then(res => res.json());
}

const verifyProof = (proof, jwt) => {
  const body = JSON.stringify({
    'nuid.credential.challenge/jwt': jwt,
    'nuid.credential/proof': proof
  });

  const opts = {
    method: 'POST',
    headers: getHeaders(),
    body: body
  };

  return fetch(`${apiRootUrl}/challenge/verify`, opts).then(res => res);
}

const decodeJwtPayload = (jwt) => {
  let payloadBase64 = jwt.split('.')[1];
  let json = Buffer.from(payloadBase64, 'base64').toString();

  return JSON.parse(json);
}

const getHeaders = () => {
  const headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  return headers;
}

module.exports = {
  createCredentials,
  getCredentails,
  challengeCredentials,
  verifyProof,
  decodeJwtPayload
}