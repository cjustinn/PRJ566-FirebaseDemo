import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, updateProfile } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react';
import { CapitalizeWord } from './HelperFunctions';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/*
    Initializes the app object.
    There should generally not be any time where you need to actually access this,
    but it's used by the other modules of Firebase (auth, storage, etc.) behind the scenes.
*/
export const firebaseApp = initializeApp({
    apiKey: "AIzaSyCE6wg1NZYJlTnd1DWewiiIjfyaEGx4-E8",
    authDomain: "fir-demo-theneighborhood.firebaseapp.com",
    projectId: "fir-demo-theneighborhood",
    storageBucket: "fir-demo-theneighborhood.appspot.com",
    messagingSenderId: "400852796060",
    appId: "1:400852796060:web:96528de1a94914243e2359"
});

/*
    The AuthContext, and it's provider below, are used for protecting routes,
    via the "useAuthState()" function.
*/
// Define the context to be used for authentication checking.
export const AuthContext = createContext();
// Define the provider for the above-defined context.
export const AuthContextProvider = props => {
    // Define a state for the user, and potential errors.
    const [user, setUser] = useState();
    const [error, setError] = useState();

    /*
        Set "unsubscribe" to watch the onAuthStateChange event, and pass it the auth (getAuth())
        object that it should watch, and the state setter methods.
    */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, error }} {...props}/>
}

/*
    useAuthState() uses the AuthContext defined above and uses it's user (set on line 39 with the "setUser" passed to the event) property to check if the user is authenticated
    or not, and stores it in the "isAuthenticated" property.
*/
export const useAuthState = () => {
    const auth = useContext(AuthContext);
    return { ...auth, isAuthenticated: auth.user != null }
}

export const GetAuthenticatedState = () => {
    return getAuth().currentUser != null;
}

/*
    RegisterWithEmail(email: string, password: string) is used to create a new user
    account in Firebase.

    Steps:
    i.      Call the "createUserWithEmailAndPassword(auth: Auth, email: String, password: String)" method,
                passing it the function parameter values received.
    ii.     If there was an error, then createUserWithEmailAndPassword's Promise return will trigger the catch method
                and return an object with "success" as false, and "errorMessage" as the caught error code.
    iii.    If the registration was a success, the Promise will resolve and trigger the then method and the steps will continue.
    iv.     Uses the fetch(address: String, config: Object) method to get two random words from an API, which returns a
                Promise.
    v.      If the api call fails, the Promise's catch method will return "success" as true, since the user was technically
                registered, and set "errorMessage" to the return error code.
    vi.     If the api call is successful, a constant variable is set to the two words mashed together as a string.
    vii.    UpdateUserProfile(profileObj: Object) is called to update the user's profile, setting it's displayName to the value
                of the freshly-defined constant variable from step iv, and the photoURL property to a generic non-null profile image.
    viii.   The function returns "success" as true, and "errorMessage" as null.
    ix.     RegisterWithEmail returns a Promise to wherever it was invoked from, which resolves to that { success: Boolean, errorMessage: String } object format.

    **I included "setPersistence(auth: Auth, persistence: Persistence" in the function, but you only ever need to call that once for the entire lifecycle of
            the app.
*/

/**
 * Registers a new user within the Firebase project with the provided email and password.
 * 
 * @param {String} email The email address used for the account.
 * @param {String} password The password used for the account.
 * @returns {Promise<{ success: Boolean, errorMessage: String }>} A Promise which resolves to an object containing the success status and the potential error code.
 * 
 */
export const RegisterWithEmail = (email, password) => {
    return setPersistence(getAuth(), browserLocalPersistence).then(() => {

        // Create the new user with Firebase.
        return createUserWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
            // Fetch two random words from the api I found on google.
            fetch(`https://random-word-api.herokuapp.com/word?number=2`).then((words) => {
                // Return the words returned as parsed JSON.
                return words.json();
            }).then((wordsArray) => {
                // Create a const variable to hold the new display name, and set it to the capitalized version of both words put together.
                const newDisplayName = `${CapitalizeWord(wordsArray[0])}${CapitalizeWord(wordsArray[1])}`;
                
                // Update the user profile, providing it with the new displayName and photoURL values.
                UpdateUserProfile({ displayName: newDisplayName, photoURL: `https://firebasestorage.googleapis.com/v0/b/fir-demo-theneighborhood.appspot.com/o/Defaults%2FDefaultPfp.png?alt=media&token=4b7ec807-ff47-4853-ab56-4719eb633af8` });
                
                // Return the expected object format, showing that there were no errors and that the user was registered.
                return { success: true, errorMessage: null };
            }).catch((err) => {
                // Return the object showing that success was true, but there was an error along the way.
                return { success: true, errorMessage: err.code};
            });
        }).catch((err) => {
            // Return the object showing that the user was not registered, and provide the error code.
            return { success: false, errorMessage: err.code };
        })

    }).catch((err) => {
        // Return the object showing that the user was not registered because persistence could not be set, and provide the error code.
        return { success: false, errorMessage: err.code };
    });
}

/*
    LoginWithEmail(email: String, password: String) is used to authenticate the user with an
    already-existing Firebase account within the project.

    Steps:
    i.      Call the signInWithEmailAndPassword(auth: Auth, email: String, password: String) method provided in the 'firebase/auth'
                module, which returns a Promise resolving to UserCredentials if successful.
    ii.     If the sign-in attempt fails, the catch block will trigger and return a Promise resolving to { success: false, errorMessage: err.code } to it's
                invocation, indicating that login failed and providing the user with a reason why.
    iii.    If the sign-in attempt is succesful, the then block will trigger and return a Promise resolving to { success: true, errorMessage: null } to it's
                invocation, indicating to the page that sign-in was successful and that there were no errors.

    **Just like in the register user function, "setPersistence" is included here when it doesn't need to be-- it only needs to be called once for the entire
            app. It should be done outside of a function entirely, after the app is initialized, as far as I'm aware.
*/

/**
 * Uses Firebase authentication to authenticate the user with the provided email and password.
 * 
 * @param {String} email The email address belonging to the account.
 * @param {String} password The password used to log into the account.
 * @returns {Promise<{ success: Boolean, errorMessage: String }>} A Promise resolving to an object containing success status and potential error code.
 * 
 */
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

// Uses the "signOut(auth: Auth)" function from the 'firebase/auth' module to de-authenticate the current user.
export const LogoutUser = () => {
    signOut(getAuth());
}

/*
    UpdateUserProfile(profileObject: Object) is used for updating the currently-signed-in user's profile information.

    Steps:
    i.      Call the "updateProfile(user: User, data: Object)" function provided by 'firebase/auth' module, and provide
                it with the current user, and the profileObject parameter passed to the UpdateUserProfile function.
    ii.     If the updateProfile Promise is rejected due to an error, the catch block will trigger and the function will
                return a Promise resolving to { success: false, errorMessage: err.code } to it's invocation to let the
                user know that the update failed, and what the problem was.
    iii.    If the updateProfile Promise is resolved successfully, the function returns a Promise resolving to { success: true,
                errorMessage: `Account details have been updated!` }, to let the user know that the update was successful, and
                errorMessage is used to provide the success message (I didn't want to add a whole extra parameter, but I should have).
*/

/**
 * Used to call the Firebase functions to update the current users profile with the provided photoURL and displayName changes.
 * "photoURL" and "displayName" are both optional, and only need to be included if there is a change.
 * 
 * @param {Object} profileObject Contains "photoURL" and/or "displayName" to be updated in the user object.
 * @returns {Promise<{ success: Boolean, errorMessage: String }>} A Promise which resolves to an object indicating success or failure to update the user in Firebase, and the potential error code.
 */
export const UpdateUserProfile = (profileObject) => {
    return updateProfile(getAuth().currentUser, profileObject).then(() => {
        return { success: true, errorMessage: `Account details have been updated!` }
    }).catch((err) => { return { success: false, errorMessage: err.code } });
}

// Receives an error code, and parses it with a switch statement to return a full-string version of the error as a displayable message.
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
        case 'auth/weak-password':
            errorMessage = "The password entered is too weak.";
            break;
        default:
            errorMessage = "An unknown error has occurred.";
            break;
    }

    return errorMessage;
}

// Gets the current user from the auth object, and then returns it as a reformatted object with only the desired information included.
export const GetUserProfile = () => {
    const user = getAuth().currentUser;
    if (!user) return null;
    else {
        return {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            uid: user.uid,
            meta: user.metadata,
            profilePicture: user.photoURL
        };
    }
}

/*
    UploadProfilePicture(pfp: File) is used to upload an image file to Firebase Storage, and get it's download URL.

    Steps:
    i.      Create a constant reference to the storage object (getStorage()).
    ii.     Create a constant reference to a location in the project's storage; in this case, to `ProfileImages/${pfp.name}`.
                Firebase Storage will always assume the starting position is in the root of the storage directory when creating a reference.
                the `ProfileImages/` portion will tell it that you want to point into the "ProfileImages" folder, and the "pfp.name" will
                tell it the specific file name you want to reference.
    iii.    Call the "uploadBytes(ref: Reference, file: File)" function provided in the 'firebase/storage' module to upload the image to the
                provided reference location. Since the "pfpRef" reference points to a non-existing file, the saved file will be saved as the
                non-existant one referenced.
    iv.     If the upload is unsuccessful, the catch block will trigger and the function will return a Promise resolving to { success: false,
                errorMessage: err.code } to indicate to the user that the upload failed and what the problem was.
    v.      If the upload is successful, then we use the "getDownloadURL(ref: Reference)" function from the 'firebase/storage' module to find
                the access URL of the newly uploaded image.
    vi.     If the getDownloadURL function fails, the catch block will return a Promise resolving to { success: true, errorMessage: err.code }
                to let the user know that the file was technically uploaded, but there was a problem so the URL couldn't be retrieved.
    vii.    If the getDownloadURL function succeeds, the then block will return a Promise resolving to { success: true, errorMessage: null,
                url: imgURL }, to let the user know that the file was successfully uploaded, there were no errors, and provide the URL of the image
                to be used to update their photoURL property.
*/

/**
 * 
 * @param {File} pfp The image file to be uploaded to Firebase.
 * @returns {Promise<{ success: Boolean, errorMessage: String | null, url?: String | null }} A Promise resolving to an object with the success status, potential error message, and potential image url.
 */
export const UploadProfilePicture = (pfp) => {
    const storage = getStorage();
    const pfpRef = ref(storage, `ProfileImages/${pfp.name}`);

    return uploadBytes(pfpRef, pfp).then((snapshot) => {

        return getDownloadURL(pfpRef).then((imgURL) => {
            return { success: true, errorMessage: null, url: imgURL };
        }).catch((err) => {
            return { success: true, errorMessage: err.code };
        });

    }).catch((err) => {
        return { success: false, errorMessage: err.code };
    });
}