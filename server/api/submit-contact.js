const fs = require('fs');
const path = require('path');

// 코드 하이픈 추가 함수
const addHyphenToCode = (code) => {
  return code.replace(/(\d{4})(?=\d)/g, '$1-');
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { name, phone, code } = req.body;
    const formattedCode = addHyphenToCode(code);

    if (!name || !phone || !code) {
      return res.status(400).json({ success: false, message: '모든 필드를 채워주세요.' });
    }

    const databasePath = path.join(__dirname, '../database.json');
    try {
      const data = fs.readFileSync(databasePath, 'utf8');
      const database = JSON.parse(data);

      const codeEntry = database.find((entry) => entry.code === formattedCode);

      if (!codeEntry) {
        return res.status(400).json({ success: false, message: '유효하지 않은 코드입니다.' });
      }

      // 정보 저장
      codeEntry.name = name;
      codeEntry.phone = phone;
      codeEntry.isempty = 0;

      fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), 'utf8');

      return res.status(200).json({ success: true, message: '연락처가 성공적으로 저장되었습니다.' });
    } catch (err) {
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
