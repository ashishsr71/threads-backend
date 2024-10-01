// // import { sendMessage } from '../controllers/messages';

// const { Kafka,Producer } = require('kafkajs');
// // import { Kafka, Producer } from "kafkajs";
// // import fs from "fs";
// // import path from "path";
// // import prismaClient from "./prisma";
// const fs=require('fs');
// const path=require('path');
// const {Message,Conversesation}=require('../modals/modals');
// const { error } = require('console');

// const kafka = new Kafka({
//   brokers: ["kafka-17acc8aa-romiljayson123-6b0b.c.aivencloud.com:15200"],
//   ssl: {
//     ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
//   },
//   sasl: {
//     username: process.env.KAFKA_USERNAME,
//     password: process.env.KAFKA_PASSWORD,
//     mechanism: "plain",
//   },
// });

// let producer= null;

//  async function createProducer() {
//   if (producer) return producer;

//   const _producer = kafka.producer();
//   await _producer.connect();
//   producer = _producer;
//   return producer;
// }

//  async function produceMessage(message) {
//   const producer = await createProducer();
//   const msg=JSON.parse(message);
// //   console.log(typeof(message))
//   await producer.send({
//     messages: [{ key:JSON.stringify(msg.senderId+msg.senderId), value: message }],
//     topic: "MESSAGES",
//   });
//   return true;
// }

//  async function startMessageConsumer() {
//   console.log("Consumer is running..");
//   const consumer = kafka.consumer({ groupId: "default" });
//   await consumer.connect();
//   await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

//   await consumer.run({
//     autoCommit: true,
//     eachMessage: async ({ message, pause }) => {
//       // console.log(message)
//       if (!message.value) return;
//       console.log(`New Message Recv..`);
//       // console.log(message.value)
//       const msg=JSON.parse(message.value);
//       console.log(msg);
//       try {
//         let converse= await Conversesation.findOne({participants:{$all:[msg.senderId,msg.reciepentId]}});
// if(!converse){
//   converse= await Conversesation.create({participants:[msg.senderId,msg.reciepentId],lastmessage:{text:msg.text,seen:false,sender:{reciepentId:msg.reciepentId,senderId:msg.senderId}}});
// }else{
//    converse.updateOne({lastmessage:{text:msg.text,seen:false,sender:{reciepentId:msg.reciepentId,senderId:msg.senderId}}});
//    await converse.save();
// };

// const message=await Message.create({text:msg.text,recieverId:msg.reciepentId,senderId:msg.senderId,conversesationId:converse._id,to:{}});
//         // await sendMessage();The on 
//         // this is what about you will get to know to what is go
//       } catch (err) {
//         console.log(err)
//         console.log("Something is wrong");
//         pause();
//         setTimeout(() => {
//           consumer.resume([{ topic: "MESSAGES" }]);
//         }, 60 * 1000);
//       }
//     },
//   });
// }
// module.exports= kafka;
// module.exports={produceMessage,startMessageConsumer}