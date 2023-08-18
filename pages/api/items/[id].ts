import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { id } = req.query;
    const item = await client.item.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                }
            },
        }
    });

    //related items search with prisma
    const searchTerms = item?.name.split(" ").map((word) => ({
        name: {
            contains: word,
        },
    }));
    const relatedItems = await client.item.findMany({
        where: {
            OR: searchTerms,
            AND: {
                id: {
                    not: item?.id,
                },
            },
        },
    });
    console.log(relatedItems)
    res.json({ ok: true, item, relatedItems });
}

export default withApiSession(withHandler({
    methods: ["GET"],
    handler,
}));