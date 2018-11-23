"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(Object.assign({}, functions.config().firebase, { timestampsInSnapshots: true }));
exports.sendToUser = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    const userId = request.body.userId;
    const message = request.body.message;
    const payload = {
        notification: {
            title: 'Hola',
            body: message,
            sound: 'default',
        }
    };
    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    const devices = yield devicesRef.get();
    const tokens = [];
    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token);
    });
    if (tokens.length > 0) {
        yield admin.messaging().sendToDevice(tokens, payload);
    }
    response.send({ rta: true });
}));
//# sourceMappingURL=index.js.map