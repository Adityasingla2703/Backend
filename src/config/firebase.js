const admin = require('firebase-admin');

/**
 * Firebase Database Configuration
 * Initialize Firebase Admin SDK
 */

let firebaseApp;

try {
  // Check if credentials are available
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    // Initialize Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });

    console.log('✅ Firebase initialized successfully');
  } else {
    console.log('⚠️  Firebase credentials not found. Database features will be disabled.');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

/**
 * Save campaign to Firebase
 * @param {string} userId - User ID
 * @param {Object} campaignData - Campaign data to save
 * @returns {Promise<string>} - Document ID
 */
async function saveCampaignFirebase(userId, campaignData) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const db = admin.firestore();
    const campaignRef = db.collection('users').doc(userId).collection('campaigns').doc();

    await campaignRef.set({
      ...campaignData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Campaign saved to Firebase: ${campaignRef.id}`);
    return campaignRef.id;
  } catch (error) {
    console.error('❌ Firebase save error:', error);
    throw error;
  }
}

/**
 * Get user's campaigns from Firebase
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of campaigns
 */
async function getUserCampaignsFirebase(userId) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const db = admin.firestore();
    const campaignsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('campaigns')
      .orderBy('createdAt', 'desc')
      .get();

    const campaigns = [];
    campaignsSnapshot.forEach((doc) => {
      campaigns.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return campaigns;
  } catch (error) {
    console.error('❌ Firebase fetch error:', error);
    throw error;
  }
}

/**
 * Delete campaign from Firebase
 * @param {string} userId - User ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<void>}
 */
async function deleteCampaignFirebase(userId, campaignId) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const db = admin.firestore();
    await db
      .collection('users')
      .doc(userId)
      .collection('campaigns')
      .doc(campaignId)
      .delete();

    console.log(`✅ Campaign deleted from Firebase: ${campaignId}`);
  } catch (error) {
    console.error('❌ Firebase delete error:', error);
    throw error;
  }
}

module.exports = {
  firebaseApp,
  saveCampaignFirebase,
  getUserCampaignsFirebase,
  deleteCampaignFirebase
};
