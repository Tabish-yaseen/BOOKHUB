const amqp = require('amqplib/callback_api');

function publishNewBookNotification(bookData) {
  amqp.connect('amqp://localhost', (error0, connection) =>{
    if (error0) {
      throw error0;
    }
    // creating the channel
    connection.createChannel((error1, channel) =>{
      if (error1) {
        throw error1;
      }   
       
// defining exchange and routing key
      const exchange = 'book_notifications';
      const routingKey = 'new_book';
         // asserting the exchange inside the channel
      channel.assertExchange(exchange, 'direct', {
        durable: false,
      })

      const message = JSON.stringify(bookData)
// publish the message into the rabbitmq
       channel.publish(exchange, routingKey, Buffer.from(message));
      console.log(`Sent book notification: ${message}`);
    });
    // closing the connection 
    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

module.exports = { publishNewBookNotification };
