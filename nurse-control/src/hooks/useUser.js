import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const useUser = () => {
  const [authUser, setAuthUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setAuthUser(user);
        setInitializing(false);
      } else {
        setAuthUser(null);
        setInitializing(false);
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  return [authUser, initializing];
};

export default useUser;
