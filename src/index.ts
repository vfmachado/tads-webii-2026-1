import express from 'express';

const detalheAluno = (id: number, nome: string, hobby: string) => {
  return `
    <html>
      <head>
        <title>Detalhes do Aluno</title>
      </head>
      <body>
        <h1>Detalhes do Aluno</h1>
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Hobby:</strong> ${hobby}</p>
      </body>
  `
}

const alunos = [
  { id: 1, nome: 'Guilherme', hobby: 'games' },
  { id: 2, nome: 'Adriana', hobby: 'leitura' },
  { id: 3, nome: 'Bruno', hobby: 'musica' },
];

const app = express();
const port = process.env.PORT || 3333;

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/', (_req, res) => {
  // res.send('Hello from TypeScript + Express in WEB II!');
  res.render('home', { titulo: 'Bem-vindo a WEBII com Express+TS + EJS!' });
});

app.get('/alunos', (_req, res) => {
  res.json(alunos);
});

app.get('/alunos/:idAluno', (req, res) => {
  // validacao
  const idAluno = parseInt(req.params.idAluno);
  if (isNaN(idAluno)) {
    return res.status(400).json({ error: 'ID do aluno é obrigatório e deve ser um número.' });
  }
  
  // processamento - encontrar o aluno certo
  const aluno = alunos.find(a => a.id === idAluno);
  if (!aluno) {
    return res.status(404).json({ error: 'Aluno não encontrado.' });
  }
  
  // resposta
  const resultado = detalheAluno(aluno.id, aluno.nome, aluno.hobby);
  res.send(resultado);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
