const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// CORS 설정
app.use(cors());
app.use(express.json());  // JSON 요청을 처리하도록 설정

app.post('/api/validate-code', (req, res) => {
  const { code } = req.body;
  const databasePath = path.join(__dirname, '../database.json');
  const database = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));

  // 코드 검증 (isempty 필드도 확인)
  const codeEntry = database.find((entry) => entry.code === code && entry.isempty === 1);

  if (codeEntry) {
    res.json({ valid: true });
  } else {
    res.json({
      valid: false,
      message: '입력하신 코드는 사용할 수 없습니다. 또는 이미 사용된 코드입니다.',
    });
  }
});

app.post('/api/submit-contact', (req, res) => {
  const { name, phone, code } = req.body;
  const addHyphenToCode = (code) => {
    return code.replace(/(\d{4})(?=\d)/g, '$1-');
  };
  const formattedCode = addHyphenToCode(code);

  console.log('Received data:', req.body);

  if (!name || !phone || !code) {
    return res.status(400).json({ success: false, message: '모든 필드를 채워주세요.' });
  }

  const databasePath = path.join(__dirname, '../database.json');
  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    let database;
    try {
      database = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    const codeEntry = database.find((entry) => entry.code === formattedCode);

    if (!codeEntry) {
      return res.status(400).json({ success: false, message: '유효하지 않은 코드입니다.' });
    }

    codeEntry.name = name;
    codeEntry.phone = phone;
    codeEntry.isempty = 0;

    fs.writeFile(databasePath, JSON.stringify(database, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
      }

      return res.json({ success: true, message: '연락처가 성공적으로 저장되었습니다.' });
    });
  });
});

// Express 서버를 서버리스 함수로 내보내기
module.exports = app;
