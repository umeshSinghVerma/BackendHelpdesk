const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  index: {type:Number,required:true},
  type: {type:String,required:true},
  text: {type:String,required:true},
  userId: {type:String,required:true}
});

const menuSchema = new Schema({
  blogMenuId: {type:Number,required:true},
  title: {type:String,required:true},
  content: {
    type: Map,
    of: contentSchema
  }
});

const blogSchema = new Schema({
  blogindex: {type:Number,required:true},
  blogHeading: {type:String,required:true},
  blogMenus: {
    type: Map,
    of: menuSchema
  },
  userId: {type:String,required:true}
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
