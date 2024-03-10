const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const exchange = 'book_notifications';
    const routingKey = 'new_book';
    const queueName = 'book_notification_queue'; 

    channel.assertExchange(exchange, 'direct', {
      durable: false,
    });

    channel.assertQueue(queueName, {
      durable: true, 
    });

    channel.bindQueue(queueName, exchange, routingKey);

    console.log(` [*] Waiting for book notifications. To exit press CTRL+C`);

    channel.consume(queueName, function (msg) {
      try {
        const bookData = JSON.parse(msg.content.toString());
        console.log(` [x] Received book notification: ${msg.content.toString()}`);
        channel.ack(msg);
      } catch (error) {
        console.error(`Failed to process message: ${error.message}`);
  
      }
    }, {
      noAck: false,
    });
  });
});
