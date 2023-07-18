import client from "@/libs/client";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    if(req.method !== "POST") {
        res.status(401).end();
    }
    //req.body는 req의 인코딩을 기준으로 인코딩 됨
    console.log(req.body.email)
    res.status(200).end();
}