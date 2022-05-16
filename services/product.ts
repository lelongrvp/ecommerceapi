import { IProduct } from "../interfaces/IProduct";
import { DuplicateException } from "../exceptions/DuplicateException";
import { prisma } from "./InitPrismaClient";

export const getProducts = async (page: number = 0, pageSize: number = 10) => {
    return prisma.product.findMany({
        skip: page * pageSize,
        take: pageSize,
    })
}

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

export const getProductLikeTitle = async (title: string, page: number = 0, pageSize: number = 10) => {
    return prisma.product.findMany({
        skip: page * pageSize,
        take: pageSize,
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

export const updateProduct = async (product: IProduct) => {
    const dbProduct = await getProductById(product.id);
    if (dbProduct) {
        if (dbProduct.title === product.title) {
            throw DuplicateException("Duplicate product title")
        }

        const updatedProduct: IProduct = {
            ...dbProduct,
            title: product.title ? product.title : dbProduct.title,
            description: product.description ? product.description : dbProduct.description,
            imgUrl: product.imgUrl ? product.imgUrl : dbProduct.imgUrl,
            price: product.price ? product.price : dbProduct.price.toNumber(),
            category: product.category ? product.category : dbProduct.category
        }
        //disconect all connection to other table
        await prisma.product.update({
            where: {
                id: dbProduct.id,
            },
            data: {
                category: {
                    set: []
                }
            }
        })

        return prisma.product.update({
            where: {
                id: dbProduct.id
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

export const deleteProduct = async (productId: number) => {
    const dbProduct = await getProductById(productId);
    if (dbProduct) {
        return prisma.product.delete({
            where: {
                id: productId
            }
        })
    }

    return null;
}