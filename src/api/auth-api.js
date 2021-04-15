import * as firebase from 'firebase';
import 'firebase/firestore';
import {Alert} from 'react-native';

export async function registration(email, password, lastName, firstName) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    const db = firebase.firestore();
    db.collection('users')
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        lastName: lastName,
        firstName: firstName           
        
      });
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}


export async function signIn(email, password) {
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

export async function getMarker(markerRetreived) {
  var marker = [];
  var snapshot = await firebase.firestore()
    .collection('markers')
    .orderBy('createdAt')
    .get()

  snapshot.forEach((doc) => {
    const markerItem = doc.data();
    markerItem.id = doc.id;
    marker.push(markerItem);
  });

   markerRetreived(marker);
}


