// /api/register.js  (Vercel Serverless Function)
const admin = require('firebase-admin');
const cors = require('cors');

// Firebase 초기화 (이미 초기화된 경우 스킵)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();
const corsHandler = cors({ origin: '*' }); // 필요하면 도메인 제한

module.exports = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { name, phone } = req.body;

    // --- 필수값 검증 ---
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: '이름과 전화번호를 모두 입력하세요.' });
    }

    try {
      // Firestore에 저장
      await db.collection('contacts').add({
        name,
        phone,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ success: true, message: '연락처가 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error('Firestore 오류:', error);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  });
};
