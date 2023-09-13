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
    const salesLists = await client.salesList.findMany({
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
        salesLists,
    });
}
export default withApiSession(withHandler({
    methods: ["GET"],
    handler,
}));