import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"


async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: {id},
        session: { user },
    } = req;
    const alreadyExists = await client.likeComment.findFirst({
        where: {
            userId: user?.id,
            postId: +id?.toString(),
        },
        select: {
            id: true,
        }
    });
    if (alreadyExists) {
        await client.likeComment.delete({
            where: {
                id: alreadyExists.id,
            },
        })
    } else {
        await client.likeComment.create({
            data: {
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
                post: {
                    connect: {
                        id: +id?.toString(),
                    }
                }
            }
        })
    }
    res.json({
        ok: true,
        post,
    });
    // if (!post) res.status(404).json({ ok: false, error: "Not found post" });
}
export default withApiSession(withHandler({
    methods: ["POST"],
    handler,
}));