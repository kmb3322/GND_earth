const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// CORS 설정
app.use(cors());
app.use(express.json());  // JSON 요청을 처리하도록 설정

app.post('/api/validate-code', (req, res) => {
  const { code } = req.body;  // 클라이언트에서 받은 코드
  const databasePath = path.join(__dirname, 'database.json');
  const database = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));

  // 코드 검증 (isempty 필드도 확인)
  const codeEntry = database.find((entry) => entry.code === code && entry.isempty === 1);

  if (codeEntry) {
    // 코드가 일치하고, isempty가 1인 경우
    res.json({ valid: true });  // 유효한 코드
  } else {
    // 일치하는 코드가 없거나 isempty가 1이 아닌 경우
    res.json({
      valid: false,
      message: '입력하신 코드는 사용할 수 없습니다. 또는 이미 사용된 코드입니다.',
    });
  }
});
const databasePath = path.join(__dirname, 'database.json');
app.post('/api/submit-contact', (req, res) => {
  const { name, phone, code } = req.body;
  const addHyphenToCode = (code) => {
    return code.replace(/(\d{4})(?=\d)/g, '$1-');
  };
  const formattedCode = addHyphenToCode(code);
  // 요청 본문 확인용 로그
  console.log('Received data:', req.body);

  // 필드가 모두 있는지 확인
  if (!name || !phone || !code) {
    return res.status(400).json({ success: false, message: '모든 필드를 채워주세요.' });
  }

  // 데이터베이스 읽기
  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error('데이터베이스 파일을 읽는 중 오류가 발생했습니다:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    let database;
    try {
      database = JSON.parse(data); // JSON 데이터 파싱
    } catch (parseError) {
      console.error('데이터베이스 파일 파싱 오류:', parseError);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    // 코드에 해당하는 객체 찾기
    const codeEntry = database.find((entry) => entry.code === formattedCode);

    if (!codeEntry) {
      return res.status(400).json({ success: false, message: '유효하지 않은 코드입니다.' });
    }

    // name, phone 업데이트 및 isempty 필드 0으로 변경
    codeEntry.name = name;
    codeEntry.phone = phone;
    codeEntry.isempty = 0;

    // 변경된 데이터 저장
    fs.writeFile(databasePath, JSON.stringify(database, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('데이터베이스 파일 저장 중 오류 발생:', writeErr);
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
      }

      // 성공적인 응답 반환
      return res.json({ success: true, message: '연락처가 성공적으로 저장되었습니다.' });
    });
  });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: '서버가 정상적으로 진짜 작동하고 있습니다.' });
});
