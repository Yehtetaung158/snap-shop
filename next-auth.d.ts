import NextAuth,{type DefaultSession} from "next-auth";


export type EndSession = DefaultSession["user"] &{
    id:string
    isOauth?:boolean
    isTwoFactorEnabled?:boolean
    role?:string
    name?:string
    email?:string
    image?:string
}

declare module "next-auth" {
    interface Session {
        user:ExtendSession
    }
}