const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { code } = req.body;
    const databasePath = path.join(__dirname, '../database.json');
    const database = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));

    // 코드 검증 (isempty 필드도 확인)
    const codeEntry = database.find((entry) => entry.code === code && entry.isempty === 1);

    if (codeEntry) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(400).json({
        valid: false,
        message: '입력하신 코드는 사용할 수 없습니다. 또는 이미 사용된 코드입니다.',
      });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
