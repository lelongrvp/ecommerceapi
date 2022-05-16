const router = require("express").Router();
import { getCategory, getCategories, updateCategory, deleteCategory } from "./../services/category";
import { authenticateAdmin } from './../server';

router.get("/all", async (req: any, res: any) => {
    const categories = await getCategories();
    return res.status(200).send(categories);
})

router.get("", async (req: any, res: any) => {
    const [id] = await req.query;
    
    const category = await getCategory(id);
    return res.status(200).send(category);
})

router.post("", authenticateAdmin, async (req: any, res: any) => {
    const [category] = await req.body;

    try{
        const result = await updateCategory(category);
        return res.status(201).send(result);
    }catch (err: any) {
        return res.status(400).send({message: err.message})
    }
})

router.put("", authenticateAdmin, async (req: any, res: any) => {
    const [category] = await req.body;

    try{
        const result = await updateCategory(category);
        return res.status(200).send(result);
    }catch (err: any) {
        return res.status(400).send({message: err.message})
    }
})

router.delete("", authenticateAdmin, async (req: any, res: any) => {
    const [id] = await req.query;

    const result = await deleteCategory(id);
    return res.status(200).send(result);
})