

const  router = require('express').Router();
const Controller = require('../Controllers/Posts');
const id = "\\w{24}";

router.get(`/:post(${id})?`, Controller.get);

router.post(`/`, Controller.create);

router.put(`/:post`, Controller.update)

router.delete(`/:post`, Controller.delete);

router.post(`/:post(${id})/comment`, Controller.comment)

router.put(`/:post(${id})/comment/:comment(${id})`, Controller.editComment)

router.delete(`/:post(${id})/comment`, Controller.deleteComment)

router.get(`/:post(${id})/like/:user(${id})`, Controller.like)

router.get(`/:post(${id})/unlike/:user(${id})`, Controller.unlike)

router.post(`/:post(${id})/rating`, Controller.rate)

module.exports = router;