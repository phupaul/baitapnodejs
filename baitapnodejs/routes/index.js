var express = require('express');
var router = express.Router();
var cors = require('cors');
var path = require('path');


// Cấu hình CORS options
var corsOptions = {
  origin: 'http://127.0.0.1:5500', // Đảm bảo rằng đây là URL của frontend của bạn
  optionsSuccessStatus: 200 // Để hỗ trợ trình duyệt cũ
};

// Kích hoạt CORS chỉ cho router này
router.use(cors(corsOptions));

router.get('/register', function(req, res, next) {
    // Đường dẫn tới tệp HTML của trang chính
    var indexPath = path.join(__dirname, '../views/register.html');
    res.sendFile(indexPath);
  });
  router.get('/forgotpassword', function(req, res, next) {
    // Đường dẫn tới tệp HTML của trang chính
    var indexPath = path.join(__dirname, '../views/forgot.html');
    res.sendFile(indexPath);
  });

  router.get('/reset', function(req, res, next) {
    // Đường dẫn tới tệp HTML của trang chính
    var indexPath = path.join(__dirname, '../views/reset.html');
    res.sendFile(indexPath);
  });

  router.get('/login', function(req, res, next) {
    // Đường dẫn tới tệp HTML của trang chính
    var indexPath = path.join(__dirname, '../views/Login.html');
    res.sendFile(indexPath);
  });
  router.get('/changepassword', function(req, res, next) {
    // Đường dẫn tới tệp HTML của trang chính
    var indexPath = path.join(__dirname, '../views/changepass.html');
    res.sendFile(indexPath);
  });


/* GET home page. */
router.use('/books',require('./books'));
router.use('/users',require('./users'));
router.use('/authors',require('./authors'));
router.use('/auth',require('./auth'));

module.exports = router;
