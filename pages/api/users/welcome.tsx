import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";


async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { phone, email } = req.body;
    const payload = phone ? { phone: +phone } : { email }

    //refactored user and token combined by 'createOrCreate'
    //upsert is used to update or insert.
    // const user = await client.user.upsert({
    //     where: {
    //         ...payload,

    //     },
    //     create: {
    //         name: "Anonymous",
    //         ...payload,
    //     },
    //     update: {},
    // });

    const token = await client.token.create({
        data: { 
            payload: "11114",
            user: {
                connectOrCreate: {
                    where: {
                        ...payload,
            
                    },
                    create: {
                        name: "Anonymous",
                        ...payload,
                    },
                },
            },
        },
    })

    console.log(token)




    // if(email){
    //     user = await client.user.findUnique({
    //         where: {
    //             email: email,
    //         }
    //     });
    //     if(user) console.log("found it")
    //     if(!user){
    //         console.log("Did not find. Will create.")
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous" ,
    //                 email: email,

    //             }
    //         })
    //     }
    //     console.log(user);
    // }
    // if(phone){
    //     user = await client.user.findUnique({
    //         where: {
    //             phone: +phone, //this change strings into numbers.
    //         }
    //     });
    //     if(user) console.log("found it")
    //     if(!user){
    //         console.log("Did not find. Will create.")
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous" ,
    //                 phone: +phone,

    //             }
    //         })
    //     }
    //     console.log(user);
    // }
    // if(req.method !== "POST") {
    //     res.status(401).end();
    // }

    //req.body는 req의 인코딩을 기준으로 인코딩 됨
    console.log(req.body)
    return res.status(200).end();
}

// This will return what 'withHandler' returns => function returning another function
// When this runs, it will be replaced by 'withHandler.ts'
export default withHandler("POST", handler)