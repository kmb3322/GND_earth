// api/register.js
// =====================
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

    const { name, phone } = req.body;
    if (!name || !phone)
      return res
        .status(400)
        .json({ success: false, message: '이름과 전화번호를 모두 입력하세요.' });

    try {
      /* 1) 중복 연락처 확인 */
      const dup = await db
        .collection('contacts')
        .where('phone', '==', phone)
        .limit(1)
        .get();

      if (!dup.empty) {
        const existing = dup.docs[0].data();

        // 이미 등록된 번호인데 이름이 다른 경우
        if (existing.name !== name) {
          return res.status(200).json({
            success: false,
            message: '사전에 신청하신 이름과 전화번호가 다릅니다.',
          });
        }

        // 기존 신청 내역 반환
        return res.status(200).json({
          success : true,
          ticketNo: existing.ticketNo,
          isPaid  : !!existing.isPaid,         // ✨ 추가
          message : '사전에 입력하신 참가 정보입니다.',
        });
      }

      /* 2) 트랜잭션으로 추첨 번호 발급 */
      const ticketNo = await db.runTransaction(async (t) => {
        const counterRef = db.doc('counters/registrations');
        const snap       = await t.get(counterRef);

        // counter 문서가 없으면 0으로 생성
        if (!snap.exists) t.set(counterRef, { current: 0 }, { merge: true });

        const next = (snap.data()?.current || 0) + 1;
        if (next > 500) throw new Error('정원 초과'); // 상한선

        // counter 증가
        t.update(counterRef, {
          current: admin.firestore.FieldValue.increment(1),
        });

        // 참가자 문서 생성
        t.set(db.collection('contacts').doc(), {
          name,
          phone,
          ticketNo : next,
          isPaid   : false,                    // ✨ 기본값 false
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return next;
      });

      /* 3) 응답 */
      return res.status(200).json({
        success : true,
        ticketNo,
        isPaid  : false,                       // ✨ 포함
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
