import express from 'express';
import ProductSchema from '../schemas/products.schema.js';

const router = express.Router();

// POST: 상품 생성 API
router.post('/', async (req, res, next) => {
  try {
    const { name, description, manager, password, status } = await req.body;
    const createdAt = new Date();
    const updatedAt = new Date();
    //  dbProduct: {_id: new ObjectId('6..'),name: '수박5',description: 'aa',manager: '옥테인',password: '1155',createdAt: 2024..,updatedAt: 2024.., __v: 0}
    const dbProduct = await ProductSchema.findOne({ name }).exec();
    // **** 스키마 unique 처리 안됨. 방법 찾기
    if (dbProduct) {
      return res.status(400).json({ message: '이미 등록된 상품입니다.' });
    }
    const product = new ProductSchema({
      name,
      description,
      manager,
      password,
      status: 'FOR_SALE',
      createdAt,
      updatedAt,
    });
    await product.save();
    // **** 리턴 데이터: 생성한 product를 바로 사용 vs 쿼리로 불러와서 사용 / 뭐가 나을까?
    return res.status(201).json({
      status: 201,
      massage: '상품 생성에 성공했습니다.',
      data: {
        id: product._id,
        name,
        description,
        manager,
        status: 'FOR_SALE',
        createdAt,
        updatedAt,
      },
    });
  } catch (err) {
    // **** 에러 메시지에 따라 메시지 처리 필요.
    return res
      .status(404)
      .json({ errorMessage: '상품 정보를 모두 입력해 주세요' });
  }
});

// GET: 상품 목록 조회 API
router.get('/', async (req, res, next) => {
  try {
    // 패스워드 제외 쿼리결과 불러오기, //앞의 {}는 쿼리(전체), 뒤의 {password...}는 프로젝션
    // 생성 일시 기준으로 내림차순(최신순) 정렬
    const product = await ProductSchema.find({}, { password: 0, __v: 0 })
      .sort('-createdAt')
      .exec();
    return res.status(201).json({
      status: 200,
      massage: '상품 목록 조회에 성공했습니다.',
      // **** 쿼리 결과에서 필드명 바꿔 불러오는법 확인
      data: product,
    });
  } catch {
    return res.status(404).json({ errorMessage: 'search error' });
  }
});

// GET: 상품 상세 조회 API
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const dbProduct = await ProductSchema.findById(productId, {
      password: 0,
      __v: 0,
    }).exec();
    return res.status(201).json({
      status: 200,
      message: '상품 상세 조회에 성공했습니다.',
      data: dbProduct,
    });
  } catch {
    return res.status(404).json({ errorMessage: 'detail search error' });
  }
});

// UPDATE: 상품 수정 API
router.patch('/:productId', async (req, res, next) => {
  try {
    const { name, description, manager, status, password } = await req.body;
    const { productId } = req.params;
    const dbProduct = await ProductSchema.findById(productId).exec();
    const dbPassword = dbProduct.password;
    if (password !== dbPassword) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }
    if (name) {
      dbProduct.name = name;
    }
    if (description) {
      dbProduct.description = description;
    }
    if (manager) {
      dbProduct.manager = manager;
    }
    if (status) {
      dbProduct.status = status;
    }
    dbProduct.updatedAt = new Date();
    await dbProduct.save();
    // 업데이트 시간 수정 후 패스워드 제외 db 가져오기 위해 순서 이동
    const nonPasswordDb = await ProductSchema.findById(productId, {
      password: 0,
      __v: 0,
    }).exec();
    return res.status(200).json({
      status: 200,
      message: '상품 수정에 성공했습니다.',
      data: nonPasswordDb,
    });
  } catch {
    return res.status(404).json({ errorMessage: 'update error' });
  }
});
// DELETE: 상품 삭제 API
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const dbProduct = await ProductSchema.findById(productId).exec();
    const { password } = req.body;
    const dbPassword = dbProduct.password;
    if (password !== dbPassword) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }
    await ProductSchema.deleteOne({ _id: productId });
    return res.status(200).json({
      mssage: '상품 삭제에 성공했습니다.',
      data: { _id: 1 },
    });
  } catch {
    return res.status(404).json({ errorMessage: 'delete error' });
  }
});

export default router;
