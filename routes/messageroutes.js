const { sendMessage, getConversesations } = require('../controllers/messages');
const { auth } = require('../middlewares/auth');

const messagerouter= require('express').Router();



messagerouter.post('/sendmessage',auth,sendMessage);
messagerouter.get('/getconver',auth,getConversesations);




module.exports=messagerouter;