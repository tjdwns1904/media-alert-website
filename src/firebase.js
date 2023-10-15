import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';
import { get } from 'lodash';
const firebaseConfig = {
  apiKey: "AIzaSyAIJIaRKcSO_697jTt4M0WsVTmiQEzLffk",
  authDomain: "mediaalertweb.firebaseapp.com",
  databaseURL: "https://mediaalertweb.firebaseio.com",
  projectId: "mediaalertweb",
  storageBucket: "mediaalertweb.appspot.com",
  messagingSenderId: "388316785253",
  appId: "1:388316785253:web:d337ed29982990c5e8f48c",
  measurementId: "G-1JGRRY04D8"
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const generateUserDocument = (user) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);

  const { email } = user;
  const userType = "NORMAL";
  try {
    userRef.set({
      email,
      userType: userType
    });
  } catch (error) {
    console.error("Error creating user document", error);
  }

  return getUserDocument(user.uid);
};
const getUserDocument = uid => {
  if (!uid) return null;
  try {
    const userDocument = firestore.doc(`users/${uid}`).get();
    return {
      uid
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

/**
 * SUBCRIPTIONS
 */

/**
 * Function to subscribe movies or games of user
 * @param {string} type
 * @param {object} dataRequest
 */
export const subscribed = (type, dataRequest, setSubscribed) => {
  if (!dataRequest) { return null; }
  const subscriptionsRef = firestore.collection('subscriptions');
  const request = dataRequest;
  request.type = type;
  subscriptionsRef.add(request);
  if (setSubscribed) {
    setSubscribed(true);
  }
}

export const getSubscriptionStatusByIDandUID = (id, uid, setSubscribed, setLoading, getId) => {
  if (!id || !uid) { return null; }
  const subscriptionsRef = firestore.collection('subscriptions');
  subscriptionsRef.where('userId', '==', uid).where('itemId', '==', id)
    .get().then((snap) => {
      const result = get(snap, 'docs[0].exists');
      const id = get(snap, 'docs[0].id');
      if (getId) { getId(id) }
      if (setSubscribed) { setSubscribed(result); }
      if (setLoading) { setLoading(false); }
    }).catch(() => {
      if (setLoading) { setLoading(false); }
    });
}

export const getSubScriptionByUID = (uid, setListSubscriptions, setLoading) => {
  if (!uid) { return null; }
  const subscriptionsRef = firestore.collection('subscriptions');
  subscriptionsRef.where('userId', '==', uid)
    .get().then((snap) => {
      const result = get(snap, 'docs');
      const arrayResult = Array.isArray(result) && result.map((item) => {
        const docContent = item.data();
        return ({
          docId: item && item.id,
          userId: docContent && docContent.userId,
          itemId: docContent && docContent.itemId,
          type: docContent && docContent.type,
          title: docContent && docContent.title,
          imagePoster: docContent && docContent.imagePoster,
          genres: docContent && docContent.genres,
          platforms: docContent && docContent.platforms,
          tagline: docContent && docContent.tagline,
        });
      });
      if (setListSubscriptions) { setListSubscriptions(arrayResult); }
      if (setLoading) { setLoading(false); }

    }).catch(() => {
      if (setLoading) { setLoading(false); }
    });
}

export const removeSubscriptionByDocId = (id, setLoading, setSelectedItem) => {
  if (!id) return null;
  firestore.collection('subscriptions').doc(id).delete().then(() => {
    if (setLoading) {
      setLoading();
    }
    if (setSelectedItem) {
      console.log('hahaha');
      setSelectedItem(null);
    }
  });
}

/**
 * END SUBCRIPTIONS
 */