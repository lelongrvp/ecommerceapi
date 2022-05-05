import { ICategory } from './ICategory';
export interface IProduct {
	id: number,
	title: string,
	description?: string,
	imgUrl?: string,
	price?: number,
	category?: ICategory[]
}