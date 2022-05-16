import { ICategory } from '../interfaces/ICategory';
import { DuplicateException } from '../exceptions/DuplicateException';
import { prisma } from './InitPrismaClient';

export const getCategory = async (categoryId: number) => {
	return prisma.category.findUnique({
		where: { id: categoryId }
	})
}

export const getCategories = async () => {
	return prisma.category.findMany()
}

export const createCategory = async (category: ICategory) => {
	const dbCategory = await getCategory(category.id);
	if (dbCategory?.type === category.type) {
		throw DuplicateException("Duplicate category");
	}

	return prisma.category.create({
		data: {
			type: category.type
		}
	})
}

export const updateCategory = async (category: ICategory) => {
	const dbCategory = await getCategory(category.id);
	if (dbCategory) {
		if (dbCategory.type === category.type) {
			throw DuplicateException("Duplicate category");
		}

		return prisma.category.update({
			where: {
				id: dbCategory.id
			},
			data: {
				type: category.type
			}
		})
	}

	return null;
}

export const deleteCategory = async (categoryId: number) => {
	const dbCategory = await getCategory(categoryId);
	if (dbCategory) {
		return prisma.category.delete({
			where: {
				id: categoryId
			}
		})
	}

	return null;
}