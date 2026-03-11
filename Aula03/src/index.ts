import express from 'express';
import * as PersonController from './controllers/PersonController';

const app = express();
const port = process.env.PORT || 3333;

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));

app.get('/', PersonController.index);
app.post('/people', PersonController.create);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
