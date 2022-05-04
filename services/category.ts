import { ICategory } from './../interfaces/ICategory';
import { prisma } from './initPrismaClient';

export const getCategory = async (category: ICategory) => {
	return prisma.category.findUnique({
		where: { type: category.type }
	})
}

export const getCategories = async () => {
	return prisma.category.findMany()
}


export const createCategory = async (category: ICategory) => {
	return prisma.category.create({
		data: {
			type: category.type
		}
	})
}

export const deleteCategory = async (category: ICategory) => {
	const dbCategory = await getCategory(category);
    if (dbCategory) {
        return prisma.user.delete({
            where: {
                type: category.type
            }
        })
    }

    return null;
}