const admin = require('firebase-admin');
const cors = require('cors');

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

// CORS 미들웨어 추가
const corsHandler = cors({ origin: '*' });  // '*'는 모든 도메인에서의 요청을 허용 (보안을 위해 구체적인 도메인으로 제한할 수 있음)

module.exports = async (req, res) => {
  corsHandler(req, res, async () => {  // CORS 미들웨어를 요청/응답에 적용
    if (req.method === 'POST') {
      const { name, phone, code } = req.body;

      // 필수값 체크
      if (!name || !phone || !code) {
        return res.status(400).json({ success: false, message: '모든 필드를 채워주세요.' });
      }

      try {
        // 코드 포맷 변경 (하이픈 추가)
        const formattedCode = code.replace(/(\d{4})(?=\d)/g, '$1-');

        // Firestore에서 해당 코드 찾기
        const codeRef = db.collection('codes').doc(formattedCode); 
        const doc = await codeRef.get();

        // 코드가 유효하지 않으면
        if (!doc.exists) {
          return res.status(400).json({ success: false, message: '유효하지 않은 코드입니다.' });
        }

        // 해당 코드가 사용되지 않은 경우(isempty == 1)만 처리
        const data = doc.data();
        if (data.isempty !== 1) {
          return res.status(400).json({ success: false, message: '이미 사용된 코드입니다.' });
        }

        // Firestore에 연락처 정보 저장
        await codeRef.update({
          name,
          phone,
          isempty: 0,  // 이제 코드는 사용됨
        });

        return res.status(200).json({ success: true, message: '연락처가 성공적으로 저장되었습니다.' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
      }
    } else {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  });
};
