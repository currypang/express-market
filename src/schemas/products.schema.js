import mongoose from 'mongoose';

//스키마: 상품ID, 상품명, 설명, 매니저, 상태, 등록일자, 업데이트일자
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
});

export default mongoose.model('ProductSchema', ProductSchema);
