import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

const App = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
      GoogleSignin.configure({
        webClientId: '572539751003-eqi4e3nonc65nl03k9f16l8ctehf0dvc.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      });
      isSignedIn();
    }, []);
    
  const signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log("userInfo = ", userInfo);
        setUser(userInfo)
      } catch (error) {
        console.log('Message = ', {...error});
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User Cancelled the Login Flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Signing In');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play Services Not Available or Outdated');
        } else {
        }
      }
    };

  const isSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (!!isSignedIn) {
        getCurrentUserInfo();
      } else {
        console.log('Please Login!!');
      }
    };

  const getCurrentUserInfo = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        setUser(userInfo);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          alert('User has not signed in yet');
          console.log('User has not signed in yet');
        } else {
          alert("Something went wrong. Unable to get user's info");
          console.log("Something went wrong. Unable to get user's info");
        }
      }
    };

  const signOut = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setUser({}); // Remember to remove the user from your app's state as well
        console.log("Logged out successfully!!");
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <View style={styles.main}>
        {!user.idToken ? 
          <GoogleSigninButton 
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          /> :
          <TouchableOpacity onPress={signOut}>
            <Text>Logout</Text>
          </TouchableOpacity>
        }
      </View>
    );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default App;