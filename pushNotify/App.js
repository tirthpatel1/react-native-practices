import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
// import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Text} from 'react-native';
import admin from 'firebase-admin';

async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  const userId = 'zNgSiSJ5SCEeO9cmqRVT';
  // console.log(messaging());

  // Add the token to the users datastore
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

function App() {
  useEffect(() => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          messaging()
            .getToken()
            .then((token) => {
              console.log(token);
              return saveTokenToDatabase(token);
            });

          messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
              'Notification caused app to open from background state:',
              remoteMessage.notification,
            );
            // navigation.navigate(remoteMessage.data.type);
          });

          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
              if (remoteMessage) {
                console.log(
                  'Notification caused app to open from quit state:',
                  remoteMessage.notification,
                );
                // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
              }
              // setLoading(false);
            });

          // const message = {
          //   data: {
          //     type: 'warning',
          //     content: 'A new weather warning has been created!',
          //   },
          //   topic: 'weather',
          // };

          // admin
          //   .messaging()
          //   .send(message)
          //   .then((response) => {
          //     console.log('Successfully sent message:', response);
          //   })
          //   .catch((error) => {
          //     console.log('Error sending message:', error);
          //   });

          // Listen to whether the token changes
          return messaging().onTokenRefresh((token) => {
            saveTokenToDatabase(token);
          });
        } else {
          requestUserPermission();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // }
    // else{
    //   console.log("We're not allowed to do our work!!");
    // }
  }, []);

  return <Text>Hello World!!</Text>;
}

export default App;

// export default class App extends Component {

//   async componentDidMount () {
//     // ......
//     const granted = messaging().requestPermission()
//       if (granted) {
//         console.log('User granted messaging permissions!')
//      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//         firebase
//           .messaging()
//           .getToken()
//           .then(fcmToken => {
//             if (fcmToken) {
//               // user has a device token
//               console.log('fcm')
//               console.log(fcmToken)
//             } else {
//               // user doesn't have a device token yet
//               console.log('error')
//             }
//           })
//      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//    } else {
//      console.log('User declined messaging permissions :(')
//    }
//    }

//   render() {
//     return (
//       <Text>Hello World!!</Text>
//     );
//   }
// }
