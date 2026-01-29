// api/checkCode.js
// =========================================
const admin = require('firebase-admin');
const cors  = require('cors');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId  : process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey : process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db          = admin.firestore();
const corsHandler = cors({ origin: '*' });

module.exports = async (req, res) =>
  corsHandler(req, res, async () => {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET')
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });

    const { code } = req.query;
    if (!code || !/^[A-Z]\d{4}$/.test(code))
      return res.status(400).json({ success: false, message: '잘못된 형식' });

    try {
      const snap = await db.collection('codes').doc(code.toUpperCase()).get();
      return res.status(200).json({ exists: snap.exists });
    } catch (e) {
      console.error('checkCode ▶', e);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  });
