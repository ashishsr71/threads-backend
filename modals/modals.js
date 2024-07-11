const mongoose = require('mongoose');

const {Schema} = mongoose;




// this is storyschema
const storySchema= new Schema({
  userId:String,
  likes:[{type:Schema.Types.Mixed}],
  video:{type:Schema.Types.Mixed},username:{type:String,required:true},
  createdAt: { type: Date, default: Date.now, expires: 5000 }
});


// this is posts schema
const postSchema= new Schema({ 
   userId:{type:String,required:true}
  ,likes:[{type:Schema.Types.ObjectId}],
    media:{type:Schema.Types.Mixed},createdAt:{type:Date,default:Date.now},
  text:{type:String},
  userImage:{type:String,default:''},
  username:{type:String,}
});


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
  postId:{type:String,required:true},
  replies:[{type:Schema.Types.Mixed}]
});


// this following schema
const followSchema= new Schema({
userId:{type:String,required:true},
followers:[{type:Schema.Types.ObjectId}],
following:[{type:Schema.Types.ObjectId}],
private:{type:Boolean,default:false},
userImage:{type:String,default:null}
});

// followrequest schema
const followreqSchema=new Schema({
userId:{type:String,required:true},
requests:[{type:Schema.Types.ObjectId}]
});




// modals here
const User= mongoose.model('User',userSchema);
const Story= mongoose.model('Story',storySchema);
const Post= mongoose.model('Post',postSchema);
const Comment= mongoose.model('Comment',commentSchema)
const Notification = mongoose.model('Notification',notificationSchema);
const Reply= mongoose.model('Reply',replySchema);
const Follow=mongoose.model('Follow',followSchema);
const Req=mongoose.model('Req',followreqSchema);




module.exports = {Story,Comment,Post,Notification,User,Reply,Follow,Req};







