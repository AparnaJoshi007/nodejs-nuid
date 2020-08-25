import { Router } from 'express';

const router = new Router();

const posts = [
  {
    name: "aparna",
    showTitle: "popeye the sailor man"
  },
  {
    name: "musky",
    showTitle: "tom and jerry"
  },
  {
    name: "random",
    showTitle: "Mr. Bean"
  }
]

router.get('/posts', (req, res) => {
  res.json(posts.filter(post => post.name === req.user.name));
});

module.exports = { router };