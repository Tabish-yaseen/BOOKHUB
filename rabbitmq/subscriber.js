const amqp = require('amqplib/callback_api');
const {sendEmailToAuthors}=require('./emailsender')

amqp.connect('amqp://localhost',(error0, connection)=> {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel)=> {
    if (error1) {
      throw error1;
    }
    const exchange = 'book_notifications'
    const routingKey = 'new_book'
    const queueName = 'book_notification_queue'

    channel.assertExchange(exchange, 'direct', {
      durable: false,
    });

    channel.assertQueue(queueName, {
      durable: true, 
    });

    channel.bindQueue(queueName, exchange, routingKey);

    console.log(`Waiting for book notifications`)

    channel.consume(queueName, (msg) =>{
      try {
        const bookData = JSON.parse(msg.content.toString());
        sendEmailToAuthors(bookData)
        channel.ack(msg);
      } catch (error) {
        console.error(`Failed to process message: ${error.message}`);
      }
    }, {
      noAck: false,
    });
  });
});
