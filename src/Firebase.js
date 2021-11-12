import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, updateProfile } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react';
import { CapitalizeWord } from './HelperFunctions';

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyCE6wg1NZYJlTnd1DWewiiIjfyaEGx4-E8",
    authDomain: "fir-demo-theneighborhood.firebaseapp.com",
    projectId: "fir-demo-theneighborhood",
    storageBucket: "fir-demo-theneighborhood.appspot.com",
    messagingSenderId: "400852796060",
    appId: "1:400852796060:web:96528de1a94914243e2359"
  });

export const AuthContext = createContext();
export const AuthContextProvider = props => {
    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, error }} {...props}/>
}

export const useAuthState = () => {
    const auth = useContext(AuthContext);
    return { ...auth, isAuthenticated: auth.user != null }
}

export const GetAuthenticatedState = () => {
    return getAuth().currentUser != null;
}

// Create a new user
export const RegisterWithEmail = (email, password) => {
    return setPersistence(getAuth(), browserLocalPersistence).then(() => {

        return createUserWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
            // Fetch two words
            fetch(`https://random-word-api.herokuapp.com/word?number=2`).then((words) => {
                return words.json();
            }).then((wordsArray) => {
                const newDisplayName = `${CapitalizeWord(wordsArray[0])}${CapitalizeWord(wordsArray[1])}`;
                UpdateUserProfile({ displayName: newDisplayName });
                
                return { success: true, errorMessage: null };
            }).catch((err) => {
                return { success: true, errorMessage: err.code};
            });
        }).catch((err) => {
            return { success: false, errorMessage: err.code };
        })

    }).catch((err) => {
        return { success: false, errorMessage: err.code };
    });
}

// Login with an existing account.
export const LoginWithEmail = (email, password) => {
    return setPersistence(getAuth(), browserLocalPersistence).then(() => {
        return signInWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
            return { success: true, errorMessage: null };
        }).catch((err) => {
            return { success: false, errorMessage: err.code };
        });
    }).catch((err) => {
        return { success: false, errorMessage: err.code };
    });
}

// Log user out of the session
export const LogoutUser = () => {
    signOut(getAuth()).then(() => {
        alert("Signed out!");
    });
}

// Update a user's profile
export const UpdateUserProfile = (profileObject) => {
    return updateProfile(getAuth().currentUser, profileObject).then(() => {
        return { success: true, errorMessage: `Account details have been updated!` }
    }).catch((err) => { return { success: false, errorMessage: err.code } });
}

export const parseErrorMessage = (errorCode) => {
    let errorMessage = undefined;

    switch(errorCode) {
        case 'auth/user-not-found':
            errorMessage = "There is no account registered with that email address.";
            break;
        case 'auth/wrong-password':
            errorMessage = "The password you have entered is incorrect.";
            break;
        case 'auth/user-disabled':
            errorMessage = "The account with the provided credentials is currently banned.";
            break;
        default:
            errorMessage = "An unknown error has occurred.";
            break;
    }

    return errorMessage;
}

export const GetUserProfile = () => {
    const user = getAuth().currentUser;
    if (!user) return null;
    else {
        return {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            uid: user.uid,
            meta: user.metadata
        };
    }
}