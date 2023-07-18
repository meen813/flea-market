import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";


async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST") {
        res.status(401).end();
    }
    //req.body는 req의 인코딩을 기준으로 인코딩 됨
    console.log(req.body)
    return res.status(200).end();
}

// This will return what 'withHandler' returns => function returning another function
// When this runs, it will be replaced by 'withHandler.ts'
export default withHandler("POST", handler)