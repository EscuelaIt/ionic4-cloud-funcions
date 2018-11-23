import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp({
  ...functions.config().firebase,
  timestampsInSnapshots: true
});

export const sendToUser = functions.https.onRequest(async (request, response) => {
  const userId = request.body.userId;
  const message = request.body.message;
  const payload: admin.messaging.MessagingPayload = {
    notification: {
      title: 'Hola',
      body: message,
      sound: 'default',
    }
  }
  const db = admin.firestore();
  const devicesRef = db.collection('devices').where('userId', '==', userId);
  const devices = await devicesRef.get();
  const tokens = [];
  devices.forEach(result => {
    const token = result.data().token;
    tokens.push( token );
  });
  if (tokens.length > 0) {
    await admin.messaging().sendToDevice(tokens, payload);
  }
  response.send({rta: true});
});