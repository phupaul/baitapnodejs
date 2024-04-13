var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var Res = require('../helpers/ResRender');
var { validationResult } = require('express-validator');
var checkUser = require('../validators/user')
var checkLogin = require('../middlewares/checkLogin');
var checkRole = require('../middlewares/checkRole');
var ValidateError = require('../errors/ValidateErrors')
router.get('/', checkLogin, checkRole("ADMIN", "Modifier"), async function (req, res, next) {
  let users = await userModel.find({}).exec();
  Res.ResRend(res, true, users)
});

router.get('/:id', async function (req, res, next) {
  try {
    let user = await userModel.find({ _id: req.params.id }).exec();
    Res.ResRend(res, true, user)
  } catch (error) {
    Res.ResRend(res, false, error)
  }
});

router.post('/',checkLogin, checkUser(), async function (req, res, next) {//3
  var result = validationResult(req);
  if (result.errors.length > 0) {
    throw new ValidateError(result)
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    })
    await newUser.save();
    Res.ResRend(res, true, newUser)
  } catch (error) {
    Res.ResRend(res, false, error)
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, req.body).exec()
    Res.ResRend(res, true, user);
  } catch (error) {
    Res.ResRend(res, false, error)
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, {
        status: false
      }, {
        new: true
      }).exec()
    Res.ResRend(res, true, user);
  } catch (error) {
    Res.ResRend(res, false, error)
  }
});

module.exports = router;