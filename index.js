const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Load environment variables
const PORT = process.env.PORT || 3030;

// Импортиране на имейл услугата
const { sendWelcomeEmail, sendOrderConfirmationEmail, sendPasswordResetEmail } = require('./services/emailService');

// Initialize Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Инициализиране на Firebase Admin
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Test Firestore connection
const db = admin.firestore();
db.collection('products').get()
  .then(() => console.log('Firestore connection successful'))
  .catch(error => console.error('Firestore connection error:', error));

// Auth middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('No authorization header');
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('No token in authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('Verifying token:', token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded token:', decodedToken);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Orders routes
app.post('/api/orders', authenticateUser, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const orderRef = await admin.firestore().collection('orders').add(orderData);
    const orderId = orderRef.id;
    
    // Изпращане на имейл за потвърждение на поръчката
    try {
      const userRecord = await admin.auth().getUser(req.user.uid);
      await sendOrderConfirmationEmail(
        userRecord.email, 
        userRecord.displayName || "клиент", 
        { 
          orderId, 
          items: req.body.items, 
          total: req.body.total 
        }
      );
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Продължаваме въпреки грешката в имейла
    }
    
    res.status(201).json({ id: orderId, ...orderData });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.get('/api/orders', authenticateUser, async (req, res) => {
  try {
    const ordersSnapshot = await admin.firestore()
      .collection('orders')
      .where('userId', '==', req.user.uid)
      .get();
    
    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Get additional user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();
    
    // Create a custom token that the client can use to sign in
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || userData?.displayName || '',
      photoURL: userRecord.photoURL || userData?.photoURL || '',
      customToken // This will be used by the client to get an ID token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', async (req, res) => {
  try {
    // In Firebase Admin SDK, we don't need to do anything special for logout
    // The client will handle clearing the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Error during logout' });
  }
});

// Common function to check if email exists
const checkEmailExists = async (email) => {
  try {
    console.log('[DEBUG] Starting email check for:', email);
    
    // Проверка в Firebase Auth
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log('[DEBUG] Firebase Auth user found:', {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      });
      return { exists: true, uid: userRecord.uid };
    } catch (error) {
      console.log('[DEBUG] Firebase Auth error:', error.code);
      
      if (error.code === 'auth/user-not-found') {
        // Проверка в Firestore
        const usersSnapshot = await admin.firestore()
          .collection('users')
          .where('email', '==', email)
          .get();

        if (!usersSnapshot.empty) {
          console.log('[DEBUG] Firestore user found:', usersSnapshot.docs[0].data());
          return { exists: true, uid: usersSnapshot.docs[0].id };
        }

        console.log('[DEBUG] Email is available for registration');
        return { exists: false };
      }
      throw error;
    }
  } catch (error) {
    console.error('[ERROR] Error checking email:', error);
    throw error;
  }
};

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    console.log('[DEBUG] Starting registration for:', { email, displayName });

    // Първо проверяваме дали имейлът вече съществува
    try {
      const emailCheck = await checkEmailExists(email);
      if (emailCheck.exists) {
        console.log('[DEBUG] Email already exists in the system');
        return res.status(400).json({ 
          error: 'This email is already registered. Please use a different email or try logging in.',
          details: { errorCode: 'auth/email-already-exists' }
        });
      }
    } catch (emailCheckError) {
      console.error('[ERROR] Email check error:', emailCheckError);
      // Продължаваме с регистрацията, ако проверката за имейл се провали
    }

    // Създаване на потребител във Firebase Auth
    console.log('[DEBUG] Creating new user in Firebase Auth');
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName
      });
      console.log('[DEBUG] User created successfully:', userRecord.uid);
    } catch (error) {
      console.error('[ERROR] Firebase Auth error:', error.code);
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ 
          error: 'This email is already registered. Please use a different email or try logging in.',
          details: { errorCode: error.code }
        });
      }
      throw error;
    }

    // Създаване на документ за потребителя в Firestore
    try {
      console.log('[DEBUG] Creating user document in Firestore');
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        displayName: displayName,
        email,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (firestoreError) {
      console.error('[ERROR] Firestore document creation error:', firestoreError);
      
      // Ако не успеем да създадем Firestore документ, ще изтрием потребителя от Authentication
      try {
        console.log('[DEBUG] Rollback: Deleting user from Authentication due to Firestore error');
        await admin.auth().deleteUser(userRecord.uid);
      } catch (deleteError) {
        console.error('[ERROR] Failed to delete user during rollback:', deleteError);
      }
      
      throw firestoreError;
    }

    // Изпращане на имейл за добре дошли
    try {
      await sendWelcomeEmail(email, displayName);
      console.log('[DEBUG] Welcome email sent to:', email);
    } catch (emailError) {
      console.error('[ERROR] Welcome email error:', emailError);
      // Продължаваме въпреки грешката в имейла
    }

    console.log('[DEBUG] Registration completed successfully');
    res.status(201).json({ 
      uid: userRecord.uid, 
      email: userRecord.email,
      displayName
    });
  } catch (error) {
    console.error('[ERROR] Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Error creating user',
      details: { errorCode: error.code }
    });
  }
});

// Profile update endpoint
app.put('/api/auth/profile', authenticateUser, async (req, res) => {
  try {
    console.log('[DEBUG] Received profile update request:', req.body);
    console.log('[DEBUG] User ID from token:', req.user.uid);
    
    const { displayName, photoURL } = req.body;
    const uid = req.user.uid;

    // Validate input
    if (!uid) {
      console.error('[ERROR] Missing user ID in request');
      return res.status(400).json({ error: 'Missing user ID' });
    }
    
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    
    console.log('[DEBUG] Firebase Auth update data:', updateData);

    // Update user profile in Firebase Auth (only fields that were provided)
    try {
      await admin.auth().updateUser(uid, updateData);
      console.log('[DEBUG] Firebase Auth update successful');
    } catch (firebaseError) {
      console.error('[ERROR] Firebase Auth update error:', firebaseError);
      return res.status(500).json({ error: 'Error updating Firebase Auth profile', details: firebaseError.message });
    }

    // Update user profile in Firestore
    try {
      // Check if the document exists first
      const userDoc = await admin.firestore().collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.log('[DEBUG] User document does not exist in Firestore, creating it');
        await admin.firestore().collection('users').doc(uid).set({
          ...updateData,
          email: req.user.email || '',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        console.log('[DEBUG] Updating existing Firestore document');
        await admin.firestore().collection('users').doc(uid).update({
          ...updateData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      console.log('[DEBUG] Firestore update successful');
    } catch (firestoreError) {
      console.error('[ERROR] Firestore update error:', firestoreError);
      // Continue despite Firestore error, we at least updated Firebase Auth
      console.log('[WARN] Continuing despite Firestore error');
    }

    // Get updated user data
    try {
      const userRecord = await admin.auth().getUser(uid);
      const updatedUserDoc = await admin.firestore().collection('users').doc(uid).get();
      const userData = updatedUserDoc.exists ? updatedUserDoc.data() : {};
      
      console.log('[DEBUG] Returning updated profile data');
      
      res.json({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || userData?.displayName || '',
        photoURL: userRecord.photoURL || userData?.photoURL || ''
      });
    } catch (getDataError) {
      console.error('[ERROR] Error fetching updated user data:', getDataError);
      // Return basic success response if we can't get updated data
      res.json({ 
        success: true, 
        message: 'Profile updated but could not retrieve updated data'
      });
    }
  } catch (error) {
    console.error('[ERROR] Profile update error:', error);
    res.status(500).json({ error: 'Error updating profile', details: error.message });
  }
});

// Check if email exists
app.post('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await checkEmailExists(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ error: 'Error checking email' });
  }
});

// Password reset endpoint
app.post('/api/auth/password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Проверка дали имейлът съществува
    try {
      const emailCheck = await checkEmailExists(email);
      if (!emailCheck.exists) {
        // За сигурност казваме, че имейлът е изпратен, дори и да не съществува такъв потребител
        return res.json({ success: true });
      }
    } catch (emailCheckError) {
      console.error('Error checking email:', emailCheckError);
      return res.status(500).json({ error: 'Error checking email' });
    }
    
    // Създаване на линк за възстановяване на парола
    const resetLink = await admin.auth().generatePasswordResetLink(email);
    
    // Изпращане на имейл за възстановяване на парола
    try {
      await sendPasswordResetEmail(email, resetLink);
      console.log('Password reset email sent to:', email);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ error: 'Error sending password reset email' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Error initiating password reset' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Get user data from Firebase Auth
    const userRecord = await admin.auth().getUser(uid);
    
    // Get additional user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    // Update Firestore if displayName exists in Auth but not in Firestore
    if (userRecord.displayName && !userData.displayName && userData.name !== userRecord.displayName) {
      await admin.firestore().collection('users').doc(uid).update({
        displayName: userRecord.displayName
      });
    }
    
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || userData?.displayName || userData?.name || '',
      photoURL: userRecord.photoURL || userData?.photoURL || ''
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Error getting user data' });
  }
});

// Админ ендпойнт за изтриване на потребител напълно
app.delete('/api/auth/admin/delete-user', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('[DEBUG] Starting full user deletion for email:', email);
    
    // Първо намираме потребителя в Firestore
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .get();
    
    // Изтриваме от Firestore
    if (!usersSnapshot.empty) {
      for (const doc of usersSnapshot.docs) {
        console.log('[DEBUG] Deleting Firestore user document:', doc.id);
        await admin.firestore().collection('users').doc(doc.id).delete();
      }
    }
    
    // Опитваме и от Authentication
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log('[DEBUG] Deleting Authentication user:', userRecord.uid);
      await admin.auth().deleteUser(userRecord.uid);
    } catch (authError) {
      if (authError.code !== 'auth/user-not-found') {
        throw authError;
      }
      console.log('[DEBUG] User not found in Authentication');
    }
    
    res.json({ success: true, message: 'User completely deleted' });
  } catch (error) {
    console.error('[ERROR] Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 