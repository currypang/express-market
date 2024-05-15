import express from 'express';
import ProductSchema from '../schemas/products.schema.js';

const router = express.Router();

// POST: 상품 생성 API
router.post('/', async (req, res, next) => {
  try {
    const { name, description, manager, status } = await req.body;
    const product = new ProductSchema({ name, description, manager, status });
    await product.save();
    return res.status(201).json(product);
  } catch {
    return res.status(404).json({ errorMessage: 'post error' });
  }
});

// GET: 상품 목록 조회 API
router.get('/', async (req, res, next) => {
  try {
    const product = await ProductSchema.find().sort('name').exec();
    return res.status(201).json({ product });
  } catch {
    return res.status(404).json({ errorMessage: 'search error' });
  }
});

// GET: 상품 상세 조회 API
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductSchema.findById(productId).exec();
    return res.status(201).json(product);
  } catch {
    return res.status(404).json({ errorMessage: 'detail search error' });
  }
});

// UPDATE: 상품 수정 API
router.patch('/:productId', async (req, res, next) => {
  try {
    const { name, description, manager, status } = await req.body;
    const { productId } = req.params;
    const product = await ProductSchema.findById(productId).exec();
    const productName = product.name;
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (manager) {
      product.manager = manager;
    }
    if (status) {
      product.status = status;
    }
    await product.save();
    return res.status(200).json({ mssage: `${productName} 상품 수정 성공` });
  } catch {
    return res.status(404).json({ errorMessage: 'update error' });
  }
});
// DELETE: 상품 삭제 API
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductSchema.findById(productId).exec();
    const productName = product.name;
    if (product) {
      await ProductSchema.deleteOne({ _id: productId });
      return res.status(200).json({ mssage: `${productName} 상품 삭제 성공` });
    }
    return res.status(400).json({ errorMessage: '삭제할 상품이 없습니다' });
  } catch {
    return res.status(404).json({ errorMessage: 'delete error' });
  }
});

export default router;
