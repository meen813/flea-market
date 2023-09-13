import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"


async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        session: {user},
    } = req;
    const purchasedHistories = await client.purchasedHistory.findMany({
        where: {
            userId: user?.id
        },
        include: {
            item: {
                include: {
                    _count: {
                        select: {
                            wishList: true,
                        }
                    }
                }
            }
        }
    })
    
    res.json({
        ok: true,
        purchasedHistories,
    });
}
export default withApiSession(withHandler({
    methods: ["GET"],
    handler,
}));