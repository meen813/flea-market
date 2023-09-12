import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"


async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    // console.log(req.session.user);
    const {
        session: { user },
    } = req;
    const reviews = await client.review.findMany({
        where: {
            createdForId: user?.id,
        }
    })
    res.json({
        ok: true,
        reviews,
    });
}
export default withApiSession(withHandler({
    methods: ["GET"],
    handler,
}));