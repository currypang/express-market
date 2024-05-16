import express from 'express';
import ProductSchema from '../schemas/products.schema.js';
import Joi from 'joi';

const router = express.Router();

// joi 유효성 검사 설정
const joiSchema = Joi.object({
  name: Joi.string().min(1).max(10).required().messages({
    // messages 메서드를 통해 응답 객체의 메시지 값을 컨트롤 한다. 키값은 에러객체의 type에서 확인가능
    'string.based': '설명 항목은 문자열이어야 합니다.',
    'string.max': '설명 항목은 최대 10글자 이하여야 합니다.',
    'string.min': '설명 항목은 최소 1글자 이상이어야 합니다.',
    'string.empty': '설명 항목을 입력해 주세요',
    'any.required': '설명 항목을 입력해 주세요',
  }),
  description: Joi.string().min(1).max(30).required().messages({
    'string.based': '설명 항목은 문자열이어야 합니다.',
    'string.max': '설명 항목은 최대 30글자 이하여야 합니다.',
    'string.min': '설명 항목은 최소 1글자 이상이어야 합니다.',
    'string.empty': '설명 항목을 입력해 주세요',
    'any.required': '설명 항목을 입력해 주세요',
  }),
  manager: Joi.string().min(1).max(10).required().messages({
    'string.based': '담당자 항목은 문자열이어야 합니다.',
    'string.max': '담당자 항목은 최대 10글자 이하여야 합니다.',
    'string.min': '담당자 항목은 최소 1글자 이상이어야 합니다.',
    'string.empty': '담당자 항목을 입력해 주세요',
    'any.required': '담당자 항목을 입력해 주세요',
  }),
  password: Joi.string().min(1).max(10).required().messages({
    'string.based': '비밀번호 항목은 문자열이어야 합니다.',
    'string.max': '비밀번호 항목은 최대 10글자 이하여야 합니다.',
    'string.min': '비밀번호 항목은 최소 1글자 이상이어야 합니다.',
    'string.empty': '비밀번호 항목을 입력해 주세요',
    'any.required': '비밀번호 항목을 입력해 주세요',
  }),
});

// POST: 상품 생성 API
router.post('/', async (req, res, next) => {
  try {
    // 유효성 검사, 타임스탬프 생성
    const validation = await joiSchema.validateAsync(req.body);
    const { name, description, manager, password } = validation;
    const createdAt = new Date();
    const updatedAt = new Date();
    // 입력할 상품이 DB에 존재 할 경우 에러처리
    const dbProduct = await ProductSchema.findOne({ name }).exec();
    if (dbProduct) {
      // 인자로 넘긴 nonUnique는 다음 미들웨어에서 에러로 받아온다.
      next('nonUnique');
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
    // DB에 저장
    await product.save();
    // 저장된 상품 데이터를 불러와서 응답한다.
    const savedProduct = await ProductSchema.findById(product._id, {
      password: 0,
      __v: 0,
    }).exec();
    return res.status(201).json({
      status: 201,
      massage: '상품 생성에 성공했습니다.',
      data: savedProduct,
    });
  } catch (err) {
    // 에러 객체 미들웨어로 넘기기
    next(err);
  }
});

// GET: 상품 목록 조회 API
router.get('/', async (req, res, next) => {
  try {
    // 패스워드, 버전 키 제외 쿼리결과 불러오기,생성 일시 기준으로 내림차순(최신순) 정렬
    const product = await ProductSchema.find({}, { password: 0, __v: 0 })
      .sort('-createdAt')
      .exec();
    // 상품이 없을 시 에러처리, 리턴 하지않으면 타입에러가 난다...확인해보자
    if (product.length === 0) {
      return next('empty');
    }
    // 상품이 있으면 상품 목록을 응답
    return res.status(201).json({
      status: 200,
      massage: '상품 목록 조회에 성공했습니다.',
      data: product,
    });
  } catch {
    next(err);
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
    // 상품이 없을 시 에러처리
    if (!dbProduct) {
      return next('notExist');
    }
    // 상품이 있으면 상세 데이터를 응답
    return res.status(201).json({
      status: 200,
      message: '상품 상세 조회에 성공했습니다.',
      data: dbProduct,
    });
  } catch (err) {
    next(err);
  }
});
// 수정 API를 위한 joi 유효성 검사 설정, 생성 API와는 필수여부로 갈리기 때문에 따로 작성해준다.
// min(0) -> "" 전달해도 오류안나게 처리
const updateJoiSchema = Joi.object({
  name: Joi.string().min(0).max(10).messages({
    'string.based': '설명 항목은 문자열이어야 합니다.',
    'string.max': '설명 항목은 최대 10글자 이하여야 합니다.',
  }),
  description: Joi.string().min(0).max(30).messages({
    'string.based': '설명 항목은 문자열이어야 합니다.',
    'string.max': '설명 항목은 최대 30글자 이하여야 합니다.',
  }),
  manager: Joi.string().min(0).max(10).messages({
    'string.based': '설명 항목은 문자열이어야 합니다.',
    'string.max': '설명 항목은 최대 30글자 이하여야 합니다.',
  }),
  password: Joi.string().min(1).max(10).required().messages({
    'string.based': '비밀번호 항목은 문자열이어야 합니다.',
    'string.max': '비밀번호 항목은 최대 10글자 이하여야 합니다.',
    'string.min': '비밀번호 항목은 최소 1글자 이상이어야 합니다.',
    'string.empty': '비밀번호 항목을 입력해 주세요',
    'any.required': '비밀번호 항목을 입력해 주세요',
  }),
  // '' -> 입력하지 않았을 떄 오류나지 않게 처리
  status: Joi.string().valid('FOR_SALE', 'SOLD_OUT', '').messages({
    'any.only': '상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.',
  }),
});
// UPDATE: 상품 수정 API
router.patch('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const dbProduct = await ProductSchema.findById(productId).exec();
    // 상품이 없을 시 에러처리
    if (!dbProduct) {
      return next('notExist');
    }
    const validation = await updateJoiSchema.validateAsync(req.body);
    const { name, description, manager, status, password } = validation;
    const dbPassword = dbProduct.password;
    // 패스워드가 다를 시 에러 처리
    if (password !== dbPassword) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }
    // 패스워드가 맞고, 수정할 입력값이 있는 필드만 수정
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
    // 수정 시간 업데이트
    dbProduct.updatedAt = new Date();
    // DB에 수정된 데이터 저장
    await dbProduct.save();
    // 업데이트 시간 반영된 수정된 데이트 응답
    const nonPasswordDb = await ProductSchema.findById(productId, {
      password: 0,
      __v: 0,
    }).exec();
    return res.status(200).json({
      status: 200,
      message: '상품 수정에 성공했습니다.',
      data: nonPasswordDb,
    });
  } catch (err) {
    next(err);
  }
});
// DELETE: 상품 삭제 API
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const dbProduct = await ProductSchema.findById(productId).exec();
    if (!dbProduct) {
      // 상품이 없을 시 에러 처리
      return next('notExist');
    }
    const validation = await updateJoiSchema.validateAsync(req.body);
    const { password } = validation;
    const dbPassword = dbProduct.password;
    // 패스워드가 다를 시 에러 처리
    if (password !== dbPassword) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }
    // 패스워드가 맞을 시 데이터 삭제
    await ProductSchema.deleteOne({ _id: productId });
    return res.status(200).json({
      mssage: '상품 삭제에 성공했습니다.',
      data: { _id: 1 },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
