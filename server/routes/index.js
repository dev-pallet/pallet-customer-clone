const express = require('express');
import render from './../renderer/html';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  render(req, res, {});
  //res.render('index', { title: 'Express' });
});

/* All Other ROutes. */
router.get('*', function (req, res, next) {
  render(req, res, {});
  //res.render('index', { title: 'Express' });
});

module.exports = router;
