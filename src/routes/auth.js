import { Router } from 'express';
import Zk from '@nuid/zk';
import { 
  createCredentials,
  getCredentails,
  challengeCredentials,
  verifyProof,
  decodeJwtPayload 
} from '../utils/nuid';
import { sign } from 'jsonwebtoken';

let User;
const router = new Router();

const setUserModel = (userModel) => {
  User = userModel;
};

router.post('/signup', async (req, res) => {
  try {
    let verifiableSecret = Zk.verifiableFromSecret(req.body.password);
    let credentials = await createCredentials(verifiableSecret);

    console.log('Credentails data...', credentials);
    let id = credentials['nu/id'];
    const newUser = new User({
      email: req.body.email,
      nuid: id,
      name: req.body.name
    });
    await newUser.save();
    return res.status(200).end();
  } catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.trim() });
    if (!user) {
      return done('Wrong Credentials');
    }

    // Get credentials of the user using public id
    let credentialResponse = await getCredentails(user.nuid);
    let nuidCredential = credentialResponse['nuid/credential'];
    
    // Challenge the credentials obtained using id. This step is required as the /challenge endpoint works with the credentials not registered with Nu.Id
    let credentialChallengeResponse = await challengeCredentials(nuidCredential);
    let nuidJwt = credentialChallengeResponse['nuid.credential.challenge/jwt'];
    let challenge = decodeJwtPayload(nuidJwt);

    // Verify the user's secret with their token obtained from "challenge" step
    let proofForVerification = Zk.proofFromSecretAndChallenge(req.body.password, challenge);
    let verifiedProof = await verifyProof(proofForVerification, nuidJwt);

    if(verifiedProof.status === 200) {
      let localJwt = sign({ id: user.nuid }, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({
        jwt: localJwt
      });
    } else {
      return res.status(verifiedProof.status);
    }
  }catch(err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = {
  setUserModel,
  router
};
