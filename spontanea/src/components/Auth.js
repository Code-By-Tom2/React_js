import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";

const Auth = () => {
  const [user] = useAuthState(auth);
  
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userDoc = doc(db, "users", result.user.uid);
    await setDoc(userDoc, { name: result.user.displayName, email: result.user.email, interests: [] }, { merge: true });
  };

  const logOut = () => signOut(auth);

  return (
    <div>
      {user ? (
        <button onClick={logOut}>Logout</button>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;
