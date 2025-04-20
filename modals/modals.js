
const mongoose = require('mongoose');

const {Schema} = mongoose;




// this is storyschema
const storySchema= new Schema({
  user:{type:Schema.Types.ObjectId},
  userId:{type:String,required:true},
  likes:[{type:Schema.Types.Mixed}],
  video:{type:Schema.Types.Mixed},username:{type:String,required:true},
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 180,
  },
 
});


// this is posts schema
const postSchema= new Schema({ 
   userId:{type:Schema.Types.ObjectId,ref:'User'}
  ,likes:[{type:Schema.Types.ObjectId}],
    media:{type:Schema.Types.Mixed},createdAt:{type:Date,default:Date.now},
  text:{type:String},
});


    // this is comments schema
const commentSchema = new Schema({
  replie:{type:String},
  postId:{type:String,required:true},
  by:{type:Schema.Types.Mixed},
  to:[{type:Schema.Types.Mixed}],
  likes:[{type:Schema.Types.Mixed}],
  replies:[{type:Schema.Types.Mixed}]
});

// this is notification schema
const notificationSchema = new Schema({});

// this is userschema
const userSchema= new Schema({
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true},
  private:{type:Boolean,default:false},
  userImg:{type:String,default:null}
});


// reply schema
const replySchema= new Schema({
  postId:{type:String,required:true},
  replies:[{type:Schema.Types.ObjectId,ref:'Comment'}]
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

const messageSchema=new Schema({
text:{type:String},
to:{type:Schema.Types.Mixed},
conversesationId:{type:String,required:true},
senderId:{type:String,required:true},
recieverId:{type:String},
seen:{type:Boolean}

},{timestamps:true});

const converSchema= new Schema({
  participants:[{type:Schema.Types.ObjectId ,ref:'User'}],

lastmessage:{text:{type:String},sender:{type:Schema.Types.Mixed},seen:{type:Boolean,default:false}}

},{timestamps:true});

const roomSchema=new Schema({
  roomName:{type:String},
  participants:[{type:Schema.Types.Mixed}],
  createdBy:{type:String},
  isActive:{type:Boolean},
  
});


const interestSchema=new Schema({
  userId:{required:true,type:String},
  categories:[{type:String}],
  likes:[{type:String}],
  tags:[{type:String}]
});

const repostSchema=new Schema({
  userId:{required:true,type:Schema.Types.ObjectId,ref:"User"},
  postId:{required:true,type:Schema.Types.ObjectId,ref:"Post"}
  
},{timestamps:true});

// modals here
const User= mongoose.model('User',userSchema);
const Updates= mongoose.model('Story',storySchema);
const Post= mongoose.model('Post',postSchema);
const Comment= mongoose.model('Comment',commentSchema)
const Notification = mongoose.model('Notification',notificationSchema);
const Reply= mongoose.model('Reply',replySchema);
const Follow=mongoose.model('Follow',followSchema);
const Req=mongoose.model('Req',followreqSchema);
const Message=mongoose.model('Message',messageSchema);
const Conversesation=mongoose.model('Conversesation',converSchema);
const Rooms=mongoose.model('Room',roomSchema);
const Recommend=mongoose.model('Recommend',interestSchema)
const Repost=mongoose.model("Repost",repostSchema);

module.exports = {Repost,Updates,Comment,Post,Notification,User,Reply,Follow,Req,Message,  Conversesation,Rooms,Recommend};







