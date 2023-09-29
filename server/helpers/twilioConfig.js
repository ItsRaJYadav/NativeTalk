import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID ;
const authToken = process.env.TWILIO_AUTH_TOKEN ;
const phoneNumber = process.env.TWILIO_PHONE;

const twilioConfig = {
  accountSid,
  authToken,
  phoneNumber,
};

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

const sendSMS = async (messageText, recipientPhoneNumber) => {
  try {
    const message = await client.messages.create({
      body: messageText,
      from: twilioConfig.phoneNumber,
      to: recipientPhoneNumber,
    });
    console.log('Message sent with SID:', message.sid);
    return message.sid;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


export { twilioConfig, sendSMS };
