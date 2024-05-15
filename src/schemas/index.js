import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://currypang:ddd5577@express-mongo.dbfwzbc.mongodb.net/?retryWrites=true&w=majority&appName=express-mongo',
      {
        dbName: 'ex_market',
      }
    )
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((err) => console.log(`MongoDB 연결 실패 ${err}`));
};

export default connect;
