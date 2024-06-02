const mongoose = require('mongoose');

const {Schema} = mongoose;

const storySchema= new Schema({
  userId:String,
  likes:[{type:Schema.Types.Mixed}],
  video:{type:Schema.Types.Mixed},
  createdAt: { type: Date, default: Date.now, expires: 86400 }
});
// this is posts schema
const postSchema= new Schema({ likes:[{type:Schema.Types.Mixed}],
    video:{type:Schema.Types.Mixed}});


    // this is comments schema
const commentSchema = new Schema({});

// this is notification schema
const notificationSchema = new Schema({});



const Story= mongoose.model('Story',storySchema);
const Post= mongoose.model('Post',postSchema);
const Comment= mongoose.model('Comment',commentSchema)
const Notification = mongoose.model('Notification',notificationSchema);

module.exports = {Story,Comment,Post,Notification};







