

const router =  require('express').Router();
const Controller = require('../Controllers/User');
const id = "\\w{24}";

router.get(`/:user(${id})?`, Controller.get);

router.delete(`/:user(${id})`, Controller.delete);

router.put(`/:user(${id})`, Controller.update);

router.post(`/`, Controller.create)

module.exports = router;
