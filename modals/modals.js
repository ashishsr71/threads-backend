const mongoose = require('mongoose');

const {Schema} = mongoose;




// this is storyschema
const storySchema= new Schema({
  userId:String,
  likes:[{type:Schema.Types.Mixed}],
  video:{type:Schema.Types.Mixed},
  createdAt: { type: Date, default: Date.now, expires: 86400 }
});


// this is posts schema
const postSchema= new Schema({ 
   userId:{type:String}
  ,likes:[{type:Schema.Types.ObjectId}],
    video:{type:Schema.Types.Mixed},createdAt:{type:Date,default:Date.now}});


    // this is comments schema
const commentSchema = new Schema({});

// this is notification schema
const notificationSchema = new Schema({});

// this is userschema
const userSchema= new Schema({
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true},
  private:{type:Boolean,default:false}
});


// reply schema
const replySchema= new Schema({
  userId:{type:String ,required:true},
  postId:{type:String,required:true},
  replies:[{type:Schema.Types.Mixed}]
});







// modals here
const User= mongoose.model('User',userSchema);
const Story= mongoose.model('Story',storySchema);
const Post= mongoose.model('Post',postSchema);
const Comment= mongoose.model('Comment',commentSchema)
const Notification = mongoose.model('Notification',notificationSchema);
const Reply= mongoose.model('Reply',replySchema);




module.exports = {Story,Comment,Post,Notification,User,Reply};







