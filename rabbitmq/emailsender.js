const sib = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = sib.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;
const transEmailApi = new sib.TransactionalEmailsApi()

async function sendEmailToAuthors(bookData) {
//   console.log('bookData', bookData);
  const {authorEmails,bookTitle} = bookData

  const sender = {
    email: 'bookhub@gmail.com',  
    name: 'Book Hub',               
  };

  const receivers = authorEmails.map((email) =>{
    return  { email }
  });

  const emailContent = {
    subject: 'New Book Notification',
    htmlContent: `<p>Dear author,</p><p>A new book titled "${bookTitle}" has been created. Check it out!</p><p>Regards,<br/>BookHub</p>`,
  };

  try {
    await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: emailContent.subject,
      htmlContent: emailContent.htmlContent,
    });

    console.log('Emails sent successfully');
  } catch (error) {
    console.error(`Failed to send emails: ${error.message}`);
  }
}

module.exports = { sendEmailToAuthors };
