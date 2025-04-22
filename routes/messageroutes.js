const { sendMessage, getConversesations, getSingleConversesation, messageSeen } = require('../controllers/messages');
const { auth } = require('../middlewares/auth');

const messagerouter= require('express').Router();



messagerouter.post('/sendmessage',auth,sendMessage);
messagerouter.get('/getconver',auth,getConversesations);
messagerouter.get('/getcurrent/:id/:reciepentId',auth,getSingleConversesation);
messagerouter.put('/seen',auth,messageSeen)
// messagerouter.put('/sone',auth,seenSingleMessage)


module.exports=messagerouter;