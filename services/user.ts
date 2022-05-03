import { IUser } from './../interfaces/IUser';
import { prisma } from "./initPrismaClient";

const getUser = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: { username }
    })
    return user;
}

const createUser = async (user: IUser) => {
    const createdUser = await prisma.user.create({
        data: {
            username: user.username,
            password: user.password,
            email: user.email,
            isAdmin: user.idAdmin,
            refreshToken: user.refreshToken
        }
    });
    return createdUser;
}

const updateUser = async (user: IUser) => {

}