import { ICategory } from '../interfaces/ICategory';
import { DuplicateException } from './DuplicateException';
import { prisma } from './InitPrismaClient';

export const getCategory = async (category: ICategory) => {
	return prisma.category.findUnique({
		where: { type: category.type }
	})
}

export const getCategories = async () => {
	return prisma.category.findMany()
}

export const createCategory = async (category: ICategory) => {
	const dbCategory = await getCategory(category);
	if (dbCategory?.type === category.type) {
		throw DuplicateException("Duplicate category");
	}

	return prisma.category.create({
		data: {
			type: category.type
		}
	})
}

export const updateCategory = async (oldCategory: ICategory, newCategory: ICategory) => {
	const dbCategory = await getCategory(oldCategory);
	if (dbCategory) {
		if (dbCategory.type === newCategory.type) {
			throw DuplicateException("Duplicate category");
		}

		return prisma.category.update({
			where: {
				id: dbCategory.id
			},
			data: {
				type: newCategory.type
			}
		})
	}

	return null;
}

export const deleteCategory = async (category: ICategory) => {
	const dbCategory = await getCategory(category);
	if (dbCategory) {
		return prisma.category.delete({
			where: {
				type: category.type
			}
		})
	}

	return null;
}