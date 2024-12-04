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

// Firestore 연결 테스트
module.exports = async (req, res) => {
  try {
    // Firestore에서 임의의 컬렉션에 데이터를 넣어보기
    const testCollectionRef = db.collection('testCollection');
    const testDocRef = testCollectionRef.doc('testDocument');

    // 데이터 쓰기
    await testDocRef.set({
      testField: 'Firestore 연결 성공!',
    });

    // 데이터 읽기
    const doc = await testDocRef.get();
    if (doc.exists) {
      res.status(200).json({
        success: true,
        message: 'Firestore 연결 성공!',
        data: doc.data(),
      });
    } else {
      res.status(404).json({
        success: false,
        message: '문서를 찾을 수 없습니다.',
      });
    }

  } catch (error) {
    console.error('Firestore 연결 실패:', error);
    res.status(500).json({
      success: false,
      message: 'Firestore 연결 실패',
      error: error.message,
    });
  }
};
