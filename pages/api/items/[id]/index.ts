import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === 'DELETE') {
        const { query: { id },
                session: {user}
    } = req;

        try {
            // 아이템을 삭제합니다.
            await client.item.delete({
                where: {
                    id: Number(id),
                },
            });

            res.json({ ok: true, message: "아이템이 삭제되었습니다." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ ok: false, error: "서버 오류입니다." });
        }
    } else {
        const { query: { id },
            session: { user }
        } = req;
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
        const isWished = Boolean(await client.wishList.findFirst({
            where: {
                itemId: item?.id,
                userId: user?.id,
            },
            select: {
                id: true,
            },
        }))
        res.json({ ok: true, item, isWished, relatedItems });
    }
}
export default withApiSession(withHandler({
    methods: ["GET", "DELETE"],
    handler,
}));