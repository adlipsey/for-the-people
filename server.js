firebase.auth().onAuthStateChanged( user => {
    if (user) {
        // If user state changes and 'user' exists, check Firebase Database for user
        const userReference = db.ref(`users/${user.uid}`);
        userReference.once('value', snapshot => {
            if (!snapshot.val()) {
                // User does not exist, create user entry
                userReference.set({
                    email: user.email,
                    displayName: user.displayName
                });
            }
        });
    }
});