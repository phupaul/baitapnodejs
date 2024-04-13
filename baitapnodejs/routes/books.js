var express = require('express');
var router = express.Router();
var bookModel = require('../schemas/book')
var Res = require('../helpers/ResRender');
require('express-async-errors')



//localhost:3000/books
// req.query -> loai bo cac thuoc tinh gom sort,page, limit
// thuoc tinh con lai check contain
router.get('/', async function (req, res, next) {
  let sortObj = {};
  console.log(req.query);
  let exclude = ["sort", "page", "limit"];
  let StringArray = ["author", "name"];
  let NumberArray = ["year"]
  let objQueries = JSON.parse(JSON.stringify(req.query));
  for (const [key, value] of Object.entries(objQueries)) {
    if (exclude.includes(key)) {
      delete objQueries[key];
    } else {
      if (StringArray.includes(key)) {
        objQueries[key] = new RegExp(value.replace(',', '|'), 'i');
      } else {
        if (NumberArray.includes(key)) {
          let string = JSON.stringify(value);
          let index = string.search(new RegExp('gte|gt|lte|lt', 'i'));
          if (index < 0) {
            objQueries[key] = value;
          } else {
            objQueries[key] = JSON.parse(string.slice(0, index) + "$" 
            + string.slice(index, string.length));
          }
        }
      }
    }
  }
  objQueries.isDeleted = false;
  if (req.query.sort) {
    if (req.query.sort.startsWith('-')) {
      let field = req.query.sort;
      field = field.substring(1, field.length);
      sortObj[field] = -1;
    } else {
      let field = req.query.sort;
      console.log(req.query.sort);
      sortObj[field] = 1;
    }
  }
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 5;
  var books = await bookModel.find(
    objQueries).populate({path:'author',select:"_id name"}).lean()
    .skip((page - 1) * limit).limit(limit)
    .sort(sortObj);
  res.send(books);
});

router.get('/:id', async function (req, res, next) {
  // try {
  //   var book = await bookModel.find({ _id: req.params.id });
  //   Res.ResRend(res, true, book);
  // } catch (error) {
  //   Res.ResRend(res, false, error);
  // }
  var book = await bookModel.find({ _id: req.params.id });
  Res.ResRend(res, true, book);
});

router.post('/', async function (req, res, next) {
  try {
    var newbook = new bookModel({
      name: req.body.name,
      year: req.body.year,
      author: req.body.author
    })
    await newbook.save();
    Res.ResRend(res, true, newbook);
  } catch (error) {
    Res.ResRend(res, false, error);
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    var book = await bookModel.findByIdAndUpdate(req.params.id,
      req.body, {
      new: true
    });
    Res.ResRend(res, true, book);
  } catch (error) {
    Res.ResRend(res, false, error);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    var book = await bookModel.findByIdAndUpdate(req.params.id,
      { isDeleted: true }, {
      new: true
    });
    Res.ResRend(res, true, book);
  } catch (error) {
    Res.ResRend(res, false, error);
  }
});


module.exports = router;
