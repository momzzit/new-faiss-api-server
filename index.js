const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log("index.js 파일이 실행되었습니다.");

app.get('/', (req, res) => {
  res.send('FAISS API 서버 작동 중!');
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

