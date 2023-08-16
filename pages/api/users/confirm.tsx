import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"


async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { token } = req.body;
    //prisma
    const tokenPresent = await client.token.findUnique({
        where: {
            payload: token,
        },
        include: { user: true }// user info
    });
    if (!tokenPresent) return res.status(404).end();
    req.session.user = {
        id: tokenPresent.userId //if token is there, its user id will be stored in req.session.user
    }
    await req.session.save();
    await client.token.deleteMany({
        where: {
            userId: tokenPresent.userId,
        },
    })
    res.json({ ok: true });
}
export default withApiSession(withHandler({methods: ["POST"], handler})); 