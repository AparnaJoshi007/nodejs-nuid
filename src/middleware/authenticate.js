import mongoose from 'mongoose';
import { verify } from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const unauthenticated = () => res.status(401).end();
  const unauthorized = () => res.status(403).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return unauthenticated();
  }

  const token = authHeader.split(' ')[1];
  if(!token) {
    return unauthenticated();
  }
    
  verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return unauthorized(); 
    }

    const { id: userId } = decoded;

    try {
      const user = await mongoose.model('User').findOne({ nuid: userId })

      if (!user) {
        unauthorized();
      } else {
        req.user = user;
        next();
      }
    } catch (e) {
      unauthorized();
    }
  });
};

export default authenticate;
