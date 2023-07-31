import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
import twilio from "twilio";
import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";


const resend = new Resend(process.env.RESEND_API_KEY);

const myEmail = process.env.MY_EMAIL;

const devEmail = process.env.From_Email;

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
    const user = phone ? { phone:+phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false })
    const payload = Math.floor(100000 + Math.random() * 900000) + "";

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
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user

                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        },
    });

    if (phone) {
        const message = await twilioClient.messages.create({
            messagingServiceSid: process.env.TWILIO_MSID,
            to: process.env.TEST_PHONE!, // this should be 'req.body' to send the code to real users' phone numbers.
            body: `Your login token is ${payload}.`
        });
        console.log(message);
    } else if (email){
        const email = await resend.emails.send({
            from: devEmail,
            to: myEmail,
            subject: "Hello! This is Treasure Trove Verification Email",
            text:`Your token is ${payload}`,
            html: `<strong>Your token is ${payload}</strong>`
        });
        console.log(email);
    }

    //req.body는 req의 인코딩을 기준으로 인코딩 됨
    console.log(req.body)
    return res.json({
        ok: true,
    });
}

// This will return what 'withHandler' returns => function returning another function
// When this runs, it will be replaced by 'withHandler.ts'
export default withHandler("POST", handler)