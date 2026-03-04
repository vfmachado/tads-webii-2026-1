import express from 'express';

const app = express();
const port = process.env.PORT || 3333;

app.get('/', (_req, res) => {
  res.send('Hello from TypeScript + Express in WEB II!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
