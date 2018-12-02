// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: process.env.GCP_PROJECT
});

// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest((req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
//         // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//         return res.redirect(303, snapshot.ref.toString());
//     });
// });
//
// // Listens for new messages added to /messages/:pushId/original and creates an
// // uppercase version of the message to /messages/:pushId/uppercase
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
//     .onCreate((snapshot, context) => {
//         // Grab the current value of what was written to the Realtime Database.
//         const original = snapshot.val();
//         console.log('Uppercasing', context.params.pushId, original);
//         const uppercase = original.toUpperCase();
//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to the Firebase Realtime Database.
//         // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//         return snapshot.ref.parent.child('uppercase').set(uppercase);
//     });


exports.createUser = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = snap.data();

        // access a particular field as you would any JS property
        const name = newValue.name;

        // perform desired operations ...
    });

exports.updateUser = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = change.after.data();

        // ...or the previous value before this update
        const previousValue = change.before.data();

        // access a particular field as you would any JS property
        const drugArray = newValue.drugArray;

        var drugsRef = db.collection('drugs');

        var promiseArray = []

        // var returnArray = []

        for (let i = 0; i < drugArray.length; i++) {
            promiseArray[i] = new Promise(function(resolve, reject) {
                // if (drugsRef.where('PRODUCTNDC', '==', drugArray[i]) !== null) {
                    resolve(drugsRef.where('PRODUCTNDC', '==', drugArray[i]).get())
                // } else {
                //     throw "error";
                // }
            });
            // new Promise(search (drugArray[i]));
            // returnArray[i] = search(drugArray[i])
        }

        Promise.all(promiseArray).then(function(values){
            let update = db.collection('users').doc(this.userId);
            update.set({
                drugArray: values
            })
            return drugArray;
        }).catch(err => {
            console.log('Error getting documents', err);
        });
        //
        // var update = db.collection("users").doc(this.userId);
        // update.set({
        //     drugArray: returnArray
        // });
    });

// function search (ndc) {
//
//         var query = drugsRef.where('PRODUCTNDC', '==', ndc).get()
//             .then(snapshot => {
//                 snapshot.forEach(doc => {
//                     console.log(doc.id, '=>', doc.data());
//                 });
//             }).catch(err => {
//                 return err;
//             });
//     return query;
// }