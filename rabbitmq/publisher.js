const amqp = require('amqplib/callback_api');

function publishNewBookNotification(bookData) {
  amqp.connect('amqp://localhost', (error0, connection) =>{
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) =>{
      if (error1) {
        throw error1;
      }

      const exchange = 'book_notifications';
      const routingKey = 'new_book';

      channel.assertExchange(exchange, 'direct', {
        durable: false,
      })

      const message = JSON.stringify(bookData)

       channel.publish(exchange, routingKey, Buffer.from(message));
      console.log(`Sent book notification: ${message}`);
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

module.exports = { publishNewBookNotification };
