var mongoose = require('mongoose');
const author = require('./author');
var bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    year: Number,
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"author"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

module.exports = new mongoose.model('book', bookSchema);//->books