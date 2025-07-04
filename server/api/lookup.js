// api/lookup.js
// ==============
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

    const { name, phone } = req.query;
    if (!name || !phone)
      return res.status(400).json({ success: false, message: '이름/전화번호 누락' });

    try {
      const snap = await db
        .collection('contacts')
        .where('phone', '==', phone)
        .limit(1)
        .get();

      if (snap.empty) {
        return res.status(200).json({ exists: false });
      }

      const data = snap.docs[0].data();
      const match = data.name === name;

      return res.status(200).json({
        exists   : match,
        ticketNo : match ? data.ticketNo : null,
        isPaid   : match ? !!data.isPaid : null,
        code     : match ? data.code || null : null, 
      });
    } catch (e) {
      console.error('lookup ▶', e);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  });
