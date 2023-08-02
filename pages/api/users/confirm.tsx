import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";


declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}


async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { token } = req.body;
    //prisma
    const present = await client.token.findUnique({
        where: {
            payload: token,
        },
        include: {user: true}// user info
    });
    if (!present) return res.status(404).end();
    req.session.user = { 
        id: present?.userId
    }
    await req.session.save()
    res.status(200).end();
}
export default withIronSessionApiRoute(withHandler("POST", handler), {
    cookieName: "TT session",
    password: "666563563hfhfh345345ddhgh35654645646", 
})