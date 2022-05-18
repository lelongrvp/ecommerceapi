import { getUsers, getUserById, getUserByUsername, getUserByEmail, updateUser, deleteUser } from './../services/user';
const router = require("express").Router();
import { authenticateAdmin } from './../server';

router.get("/all", authenticateAdmin, async (req: any, res: any) => {
    const [page, pageSize] = req.query;

    const users = await getUsers(page, pageSize);
    return res.status(200).send(users);
});

router.get("", async (req: any, res: any) => {
    const [id, username, email] = req.query;

    if (id) {
        const user = await getUserById(id);

        if (user) {
            return res.status(200).send();
        }

        return res.status(400).send({ message: `No user with ${id}` });
    } else if (username) {
        const user = await getUserByUsername(username);

        if (user) {
            return res.status(200).send();
        }

        return res.status(400).send({ message: `No user with ${username}` });
    } else {
        const user = await getUserByEmail(email);

        if (user) {
            return res.status(200).send();
        }

        return res.status(400).send({ message: `No user with ${email}` });
    }
});

router.put("", async (req: any, res: any) => {
    const [user] = req.body;

    const result = await updateUser(user);
    if (result) {
        return res.status(200).send(result);
    }

    return res.status(404).send();
});

router.delete("", authenticateAdmin, async (req: any, res: any) => {
    const [id] = req.query;

    const result = await deleteUser(id);
    if (result) {
        return res.status(200).send(result);
    }

    return res.status(404).send();
})

export = router;