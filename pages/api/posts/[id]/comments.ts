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
        body: {commentText}
    } = req;

    const newComment = await client.comment.create({
        data: {
            user: {
                connect: {
                    id: user?.id,
                },
            },
            post: {
                connect: {
                    id: +id?.toString(),
                },
            },
            commentText,
        },
    })
    console.log(newComment)
    // if (!post) { //need to get some 404 job done here
    //     return;
    // } 

    res.json({
        ok: true,
        comment: newComment,
    });
    // if (!post) res.status(404).json({ ok: false, error: "Not found post" });
}
export default withApiSession(withHandler({
    methods: ["POST"],
    handler,
}));