// api/register.js
// =========================================
const admin = require('firebase-admin');
const cors  = require('cors');

// ───────────── Firebase 초기화 ─────────────
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

// ───────────── 메인 핸들러 ─────────────
module.exports = async (req, res) =>
  corsHandler(req, res, async () => {
    /* 0) 프리플라이트 & 메서드 체크 */
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST')
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });

    /* 1) 파라미터 검증 */
    const { name, phone, code } = req.body;
    if (!name || !phone || !code)
      return res
        .status(400)
        .json({ success: false, message: '이름·전화번호·코드를 모두 입력하세요.' });

    try {
      /* 2) 기존 연락처 중복 확인 */
      const dup = await db
        .collection('contacts')
        .where('phone', '==', phone)
        .limit(1)
        .get();

      if (!dup.empty) {
        const existing = dup.docs[0].data();
        if (existing.name !== name) {
          return res.status(200).json({
            success: false,
            message: '사전에 신청하신 이름과 전화번호가 다릅니다.',
          });
        }

        // 이미 신청한 경우 그대로 반환
        return res.status(200).json({
          success : true,
          ticketNo: existing.ticketNo,
          isPaid  : !!existing.isPaid,
          message : '사전에 입력하신 참가 정보입니다.',
        });
      }

      /* 3) 코드 유효성 확인 */
      const codeRef  = db.collection('codes').doc(code.toUpperCase());
      const codeSnap = await codeRef.get();
      if (!codeSnap.exists) {
        return res
          .status(400)
          .json({ success: false, message: '유효하지 않은 코드입니다.' });
      }

      /* 4) 트랜잭션: counter 증가 + contacts 저장 + 코드 count++ */
      const ticketNo = await db.runTransaction(async (t) => {
        /* (1) 전역 counter */
        const counterRef = db.doc('counters/registrations');
        const counterSnap = await t.get(counterRef);
        if (!counterSnap.exists) t.set(counterRef, { current: 0 }, { merge: true });

        const next = (counterSnap.data()?.current || 0) + 1;
        if (next > 500) throw new Error('정원 초과');

        t.update(counterRef, {
          current: admin.firestore.FieldValue.increment(1),
        });

        /* (2) contacts 컬렉션에 신규 문서 추가 */
        t.set(db.collection('contacts').doc(), {
          name,
          phone,
          code: code.toUpperCase(),
          ticketNo : next,
          isPaid   : false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        /* (3) 코드 문서에 count +1 */
        t.set(
          codeRef,
          { count: admin.firestore.FieldValue.increment(1) },
          { merge: true },
        );

        return next;
      });

      /* 5) 응답 */
      return res.status(200).json({
        success : true,
        ticketNo,
        isPaid  : false,
        message : `${ticketNo}번 등록 완료!`,
      });
    } catch (err) {
      console.error('register ▶', err);
      const msg =
        err.message === '정원 초과'
          ? '정원(500명)이 모두 찼습니다.'
          : '서버 오류가 발생했습니다.';
      return res.status(500).json({ success: false, message: msg });
    }
  });
