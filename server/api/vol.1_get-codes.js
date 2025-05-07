const admin = require('firebase-admin');

// Firebase 인증 설정 (한 번만 초기화)
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

module.exports = async (req, res) => {
  try {
    // Firestore에서 'codes' 컬렉션의 모든 문서 가져오기
    const snapshot = await db.collection('codes').get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: '데이터가 없습니다.' });
    }

    // Firestore에서 가져온 데이터를 배열로 변환
    const codes = snapshot.docs.map(doc => doc.data());

    return res.status(200).json({
      success: true,
      message: '데이터를 성공적으로 가져왔습니다.',
      data: codes,
    });

  } catch (error) {
    console.error('Firestore에서 데이터를 가져오는 중 오류 발생:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message,
    });
  }
};
