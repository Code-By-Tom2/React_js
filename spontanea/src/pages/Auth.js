import React from "react";
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
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logOut}>Logout</button>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;