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
    const post = await client.post.findUnique({
        where: {
            id: +id.toString(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                },
            },
            comments: {
                select: {
                    id: true,
                    commentText: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    comments: true,
                    likeComment: true,
                }
            }
        }
    });
    const isLiked = Boolean(await client.likeComment.findFirst({
        where: {
            postId: +id.toString(),
            userId: user?.id,
        },
        select: {
            id: true,
        }
    }))
    res.json({
        ok: true,
        post,
        isLiked
    });
    // if (!post) res.status(404).json({ ok: false, error: "Not found post" });
}
export default withApiSession(withHandler({
    methods: ["GET"],
    handler,
}));