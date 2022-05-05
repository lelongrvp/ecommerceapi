import { IProduct } from "../interfaces/IProduct";
import { DuplicateException } from "./DuplicateException";
import { prisma } from "./InitPrismaClient";

export const getProductById = async (id: number) => {
    return prisma.product.findUnique({
        where: { id: id },
        include: { category: true }
    })
}

export const getProductByTitle = async (title: string) => {
    return prisma.product.findUnique({
        where: { title: title },
        include: { category: true }
    })
}

export const getProductLikeTitle = async (title: string) => {
    return prisma.product.findMany({
        where: {
            title: {
                contains: title,
                mode: 'insensitive'
            }
        },
        include: { category: true }
    })
}

export const searchProductByTitle = async (searchKey: string) => {
    return prisma.product.findMany({
        where: {
            title: {
                contains: searchKey,
                mode: 'insensitive'
            }
        },
        select: {
            title: true
        }
    })
}

export const createProduct = async (product: IProduct) => {
    const dbProduct = await getProductByTitle(product.title);
    if (dbProduct?.title === product.title) {
        throw DuplicateException("Duplicate product title")
    }

    return prisma.product.create({
        data: {
            title: product.title,
            description: product.description,
            imgUrl: product.imgUrl,
            price: product.price,
            category: {
                connect: product.category?.map(item => ({ type: item.type }))
            }
        }
    })
}

export const updateProduct = async (oldProduct: IProduct, newProduct: IProduct) => {
    const dbProduct = await getProductById(oldProduct.id);
    if (dbProduct) {
        if (dbProduct.title === newProduct.title) {
            throw DuplicateException("Duplicate product title")
        }

        const updatedProduct = {
            ...dbProduct,
            title: newProduct.title ? newProduct.title : dbProduct.title,
            description: newProduct.description ? newProduct.description : dbProduct.description,
            imgUrl: newProduct.imgUrl ? newProduct.imgUrl : dbProduct.imgUrl,
            price: newProduct.price ? newProduct.price : dbProduct.price,
            category: newProduct.category ? newProduct.category : dbProduct.category
        }
        return prisma.product.update({
            where: {
                id: oldProduct.id
            },
            data: {
                title: updatedProduct.title,
                description: updatedProduct.description,
                imgUrl: updatedProduct.imgUrl,
                price: updatedProduct.price,
                category: {
                    connect: updatedProduct.category?.map(item => ({ type: item.type }))
                }
            }
        })
    }

    return null;
}

export const deleteProduct = async (product: IProduct) => {
    const dbProduct = await getProductById(product.id);
    if (dbProduct) {
        return prisma.product.delete({
            where: {
                id: product.id
            }
        })
    }

    return null;
}