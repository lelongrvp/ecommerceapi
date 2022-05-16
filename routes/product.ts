const router = require("express").Router();
import { authenticateAdmin } from './../server';
import { getProductById, getProductByTitle, getProductLikeTitle, searchProductByTitle, createProduct, updateProduct, deleteProduct, getProducts } from '../services/product';

router.get("/all", async (req: any, res: any) => {
    const [page, pageSize] = req.query;

    const products = await getProducts(page, pageSize);
    return res.status(200).send(products);
})

//TODO: getBy, search, create, update, delete