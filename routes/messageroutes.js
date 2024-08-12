const { sendMessage, getConversesations, getSingleConversesation } = require('../controllers/messages');
const { auth } = require('../middlewares/auth');

const messagerouter= require('express').Router();



messagerouter.post('/sendmessage',auth,sendMessage);
messagerouter.get('/getconver',auth,getConversesations);
messagerouter.get('/getcurrent/:id',auth,getSingleConversesation);



module.exports=messagerouter;