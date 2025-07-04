// api/getCodes.js
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

    try {
      const snap = await db.collection('codes').get();
      if (snap.empty)
        return res.status(404).json({ success: false, message: '데이터가 없습니다.' });

      const codes = snap.docs.map((d) => ({
        id    : d.id,              // 코드 문자열
        count : d.data().count || 0,
      }));

      return res.status(200).json({
        success: true,
        message: '데이터를 성공적으로 가져왔습니다.',
        data   : codes,
      });
    } catch (e) {
      console.error('getCodes ▶', e);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  });
