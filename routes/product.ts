const router = require("express").Router();
import { authenticateAdmin } from './../server';
import { getProductById, getProductByTitle, getProductsLikeTitle, searchProductByTitle, createProduct, updateProduct, deleteProduct, getProducts } from '../services/product';

router.get("/all", async (req: any, res: any) => {
    const [page, pageSize] = req.query;

    const products = await getProducts(page, pageSize);
    if (products) {
        return res.status(200).send(products);
    }

    return res.status(404).send();
})

//TODO: getBy, search, create, update, delete
router.get("", async (req: any, res: any) => {
    const [id] = req.query;

    const product = await getProductById(id);
    if (product) {
        return res.status(200).send(product);
    }

    return res.status(404).send();
})

router.get("", async (req: any, res: any) => {
    const [title, page, pageSize] = req.query;

    const products = await getProductsLikeTitle(title);
    if (products) {
        return res.status(200).send(products);
    }

    return res.status(404).send();
})

router.get("", async (req: any, res: any) => {
    const [search] = req.query;

    const productTitles = await searchProductByTitle(search);
    return res.status(200).send(productTitles);
})

router.post("", authenticateAdmin, async (req: any, res: any) => {
    const [product] = req.body;

    try {
        const createdProduct = await createProduct(product);
        return res.status(201).send(createdProduct);
    } catch (err: any) {
        return res.status(400).send({ message: err.message })
    }
})

router.put("", authenticateAdmin, async (req: any, res: any) => {
    const [product] = req.body;

    try {
        const updatedProduct = await updateProduct(product);
        return res.status(201).send(updatedProduct);
    } catch (err: any) {
        return res.status(400).send({ message: err.message })
    }
})

router.delete("", authenticateAdmin, async (req: any, res: any) => {
    const [id] = req.query;

    const deletedProduct = await deleteProduct(id);
    return res.status(200).send(deletedProduct);
    return res.status(404).send();
})