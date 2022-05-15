import { IUser } from '../interfaces/IUser';
import { prisma } from "./InitPrismaClient";

const returnFields = {
    id: true,
    username: true,
    email: true,
    createAt: true,
    updateAt: true,
    isAdmin: true
}

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id: id },
        select: returnFields
    })
}

export const getUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
        where: { username: username },
        select: returnFields
    })
}

export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email: email },
        select: returnFields
    })
}

export const getUserByIdWithToken = async (id: number) => {
    return prisma.user.findUnique({
        where: { id: id },
    })
}

export const getUsers = async (page: number = 0, pageSize: number = 10) => {
    return prisma.user.findMany({
        skip: page * pageSize,
        take: pageSize,
        select: returnFields
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
        },
        select: returnFields
    });
}

export const updateUser = async (user: IUser) => {
    const dbUser = await getUserByIdWithToken(user.id);
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
            },
            select: returnFields
        })
    }

    return null;
}

export const deleteUser = async (userId: number) => {
    const dbUser = await getUserById(userId);
    if (dbUser) {
        return prisma.user.delete({
            where: {
                id: userId
            },
            select: returnFields
        })
    }

    return null;
}