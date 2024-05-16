import express from 'express';
import connect from './schemas/index.js';
import productsRouter from './routers/products.router.js';
// import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;

// DB연결
connect();

// 바디파서
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터

app.use('/products', productsRouter);
// app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸습니다!');
});
