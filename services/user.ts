import { IUser } from './../interfaces/IUser';
import { prisma } from "./initPrismaClient";

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
    const databaseUser = await getUserByUsername(user.username);
    if (databaseUser) {
        const updatedUser = {
            ...databaseUser,
            refreshToken: user.refreshToken ? user.refreshToken : databaseUser.refreshToken,
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