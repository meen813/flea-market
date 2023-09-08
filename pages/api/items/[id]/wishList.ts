import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession"

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { 
        query: { id },
        session: { user },
        } = req;

    //if wishList data already exists, delete the data, else create one.
    const alreadyFaved = await client.wishList.findFirst({
        where: {
            itemId: +id!.toString(), //add '!' to resolve typescript error.
            userId: user?.id,
        }
    });
    if(alreadyFaved){
        //delete
        await client.wishList.delete({
            where : {
                id: alreadyFaved.id
            }
        })
    } else {
        // create
        await client.wishList.create({
            data: {
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
                item: {
                    connect: {
                        id: +id!.toString(),  //add '!' to resolve typescript error.
                    }
                }
            },
        }) 
    }

    res.json({ ok: true });
}

export default withApiSession(withHandler({
    methods: ["POST"],
    handler,
}));