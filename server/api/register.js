// api/register.js
const admin = require('firebase-admin');
const cors  = require('cors');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId  : process.env.FIREBASE_PROJECT_ID,
      privateKey : process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}
const db = admin.firestore();
const corsHandler = cors({ origin: '*' });

module.exports = async (req, res) => corsHandler(req, res, async () => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ success:false, message:'Method Not Allowed' });

  const { name, phone } = req.body;
  if (!name || !phone)
    return res.status(400).json({ success:false, message:'이름과 전화번호를 모두 입력하세요.' });

  try {
    /* ① 중복 연락처 확인 */
    const dup = await db.collection('contacts').where('phone','==', phone).limit(1).get();
    if (!dup.empty) {
      const existing = dup.docs[0].data();
      return res.status(200).json({
        success : true,
        ticketNo: existing.ticketNo,
        message : '사전에 입력하신 참가 정보 입니다.',
      });
    }

    /* ② 트랜잭션으로 번호 발급 */
    const ticketNo = await db.runTransaction(async (t) => {
      const counterRef = db.doc('counters/registrations');
      const snap = await t.get(counterRef);

      if (!snap.exists) t.set(counterRef, { current: 0 }, { merge:true });

      const next = (snap.data()?.current || 0) + 1;
      if (next > 500) throw new Error('정원 초과');

      t.update(counterRef, { current: admin.firestore.FieldValue.increment(1) });
      t.set(db.collection('contacts').doc(), {
        name, phone, ticketNo: next,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return next;
    });

    /* ③ 응답 */
    return res.status(200).json({
      success : true,
      ticketNo,
      message : `${ticketNo}번 등록 완료!`,
    });

  } catch (err) {
    console.error('register ▶', err);
    const msg = err.message === '정원 초과' ? '정원(500명)이 모두 찼습니다.' : '서버 오류가 발생했습니다.';
    return res.status(500).json({ success:false, message: msg });
  }
});
