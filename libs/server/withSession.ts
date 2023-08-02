import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}


const cookieOptions = {
    cookieName: "TT session",
    password: process.env.WITHSESSION_COOKIE_PASSWORD!,
}

//why not 'export default'? because two export functions are required.
export function withApiSession(fn: any){
    return withIronSessionApiRoute(fn, cookieOptions)
}