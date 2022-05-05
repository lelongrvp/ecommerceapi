import { IUser } from './../interfaces/IUser';
import { prisma } from "./initPrismaClient";

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id: id }
    })
}

export const getUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
        where: { username: username }
    })
}

export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email: email }
    })
}

export const getUsers = async (page: number = 0, pageSize: number = 10) => {
    return prisma.user.findMany({
        skip: page * pageSize,
        take: pageSize
    })
}

export const createUser = async (user: IUser) => {
    return prisma.user.create({
        data: {
            username: user.username,
            password: user.password,
            email: user.email,
            isAdmin: user.isAdmin,
            refreshToken: user.refreshToken
        }
    });
}

export const updateUser = async (user: IUser) => {
    const dbUser = await getUserByUsername(user.username);
    if (dbUser) {
        const updatedUser = {
            ...dbUser,
            refreshToken: user.refreshToken ? user.refreshToken : dbUser.refreshToken,
        };
        console.log(updatedUser);
        return prisma.user.update({
            where: { username: updatedUser.username },
            data: {
                isAdmin: updatedUser.isAdmin,
                refreshToken: updatedUser.refreshToken
            }
        })
    }

    return null;
}

export const deleteUser = async (user: IUser) => {
    const dbUser = await getUserById(user.id);
    if (dbUser) {
        return prisma.user.delete({
            where: {
                id: user.id
            }
        })
    }

    return null;
}