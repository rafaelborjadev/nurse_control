import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

const useUser = () => {
  const [authUser, setAuthUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const usersRef = collection(db, 'usuarios');
        const q = query(usersRef, where('correo', '==', user.email), limit(1));
        const querySnapshot = await getDocs(q);

        let userDoc = null;
        querySnapshot.forEach((doc) => {
          userDoc = doc.data();
        });
        if (userDoc) {
          delete userDoc.password;
          setAuthUser({
            ...user,
            ...userDoc,
          });
          setInitializing(false);
          setError(null);
        } else {
          setAuthUser(null);
          setInitializing(false);
          setError(
            'El usuario que está intentando iniciar sesión no posee una cuenta en la app.'
          );
        }
      } else {
        setAuthUser(null);
        setInitializing(false);
        setError(null);
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  return [authUser, initializing, error];
};

export default useUser;
