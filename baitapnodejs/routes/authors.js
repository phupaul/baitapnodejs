var express = require('express');
var router = express.Router();
var authorModel = require('../schemas/author')
var Res = require('../helpers/ResRender');


//localhost:3000/books
// req.query -> loai bo cac thuoc tinh gom sort,page, limit
// thuoc tinh con lai check contain
router.get('/', async function (req, res, next) {
  var authors = await authorModel.find(
    {}).populate('published');
  res.send(authors);
});


router.post('/', async function (req, res, next) {
  try {
    var newauthor = new authorModel({
      name: req.body.name
    })
    await newauthor.save();
    Res.ResRend(res, true, newauthor);
  } catch (error) {
    Res.ResRend(res, false, error);
  }
});
// router.put('/:id', async function (req, res, next) {
//   try {
//     var book = await bookModel.findByIdAndUpdate(req.params.id,
//       req.body, {
//       new: true
//     });
//     Res.ResRend(res, true, book);
//   } catch (error) {
//     Res.ResRend(res, false, error);
//   }
// });

// router.delete('/:id', async function (req, res, next) {
//   try {
//     var book = await bookModel.findByIdAndUpdate(req.params.id,
//       { isDeleted: true }, {
//       new: true
//     });
//     Res.ResRend(res, true, book);
//   } catch (error) {
//     Res.ResRend(res, false, error);
//   }
// });


module.exports = router;
