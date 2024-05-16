import 'dotenv/config';
import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(process.env.MONGO_DB_KEY, {
      dbName: 'ex_market',
    })
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((err) => console.log(`MongoDB 연결 실패 ${err}`));
};

export default connect;
