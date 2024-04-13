var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var Res = require('../helpers/ResRender');
var { validationResult } = require('express-validator');
var checkUser = require('../validators/auth')
var checkChangePassword = require('../validators/changpassword')
var bcrypt = require("bcrypt")
var checkLogin = require('../middlewares/checkLogin');
const changpassword = require('../validators/changpassword');
const sendMail = require('../helpers/sendMail')
var cors  = require('cors')


//them checkpassword
router.post('/resetpassword/:token',async function (req, res, next) {
  let user = await userModel.findOne({
    tokenResetPassword: req.params.token
  })
  if (!user) {
    Res.ResRend(res, false, "URL khong hop le")
    return;
  }
  if (user.tokenResetPasswordExp > Date.now) {
    Res.ResRend(res, false, "URL khong hop le")
    return;
  }
  user.password = req.body.password;
  user.tokenResetPassword = undefined;
  user.tokenResetPasswordExp = undefined;
  await user.save();
  Res.ResRend(res, true, "cap nhat thanh cong")
});

router.post('/forgotpassword', async function (req, res, next) {
  let user = await userModel.findOne({
    email: req.body.email
  })
  if (!user) {
    Res.ResRend(res, false, "email khong ton tai")
    return;
  }
  let token = user.genResetToken();
  await user.save();
  //send URL cua cai form reset mat khau
  //http://localhost:44124/resetpass.html?token = 
  let url = `http://localhost:3000/auth/resetpassword/${token}`;
  await sendMail(user.email,url);
  Res.ResRend(res, true, "check mail bo` li")
});





router.get('/me', checkLogin, async function (req, res, next) {
  Res.ResRend(res, true, req.user)
});

router.post('/changepassword', checkLogin, changpassword(), async function (req, res, next) {
  let result = validationResult(req);
  if (result.errors.length > 0) {
    Res.ResRend(res, false, result.errors)
    return;
  }
  let userPassword = req.user.password;
  if (bcrypt.compareSync(req.body.oldpassword, userPassword)) {
    let user = await userModel.findById(req.user._id);
    user.password = req.body.newpassword;
    await user.save();
    Res.ResRend(res, true, "doi password thanh cong")
  } else {
    Res.ResRend(res, false, "oldpassword sai")
  }
});

router.post('/login',cors(), async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    Res.ResRend(res, false, "thieu thong tins");
    return;
  }
  let user = await userModel.findOne({ username: username })
  if (!user) {
    Res.ResRend(res, false, "username khong ton tai");
    return;
  }
  let result = bcrypt.compareSync(password, user.password);
  if (result) {
    let token = user.genJWT();
    res.status(200).cookie("kento", token, {
      expires: new Date(Date.now() + 3600 * 1000),
      httpOnly: true
    }).send({
      success: true,
      data: token
    })
    //Res.ResRend(res, true, user.genJWT());
  } else {
    Res.ResRend(res, false, "password sai");
  }
});

router.post('/logout', checkLogin, async function (req, res, next) {
  res.status(200).cookie("kento", 'null', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  }).send({
    success: true,
    data: "dang xuat thanh cong"
  })
})

router.post('/register', checkUser(), async function (req, res, next) {//3
  var result = validationResult(req);
  if (result.errors.length > 0) {
    Res.ResRend(res, false, result.errors);
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["user"]
    })
    await newUser.save();
    Res.ResRend(res, true, newUser)
  } catch (error) {
    Res.ResRend(res, false, error)
  }
});

module.exports = router;