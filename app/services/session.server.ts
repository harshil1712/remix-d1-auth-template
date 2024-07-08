import type { AppLoadContext } from "@remix-run/cloudflare";
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

export class SessionStorage {
    protected sessionStorage;

    public read;
    public commit;
    public destroy;

    constructor(context: AppLoadContext) {
        this.sessionStorage = createCookieSessionStorage({
            cookie: {
                name: "sdx:session",
                path: "/",
                maxAge: 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                secrets: [context.cloudflare.env.COOKIE_SESSION_SECRET ?? "s3cr3t"],
            },
        })
        this.read = this.sessionStorage.getSession;
        this.commit = this.sessionStorage.commitSession;
        this.destroy = this.sessionStorage.destroySession;
    }

    static async logout(context: AppLoadContext, request: Request) {
        let sessionStorage = new SessionStorage(context);
        let session = await sessionStorage.read(request.headers.get("cookie"));
        throw redirect("/", {
            headers: {
                "Set-Cookie": await sessionStorage.destroy(session)
            }
        })
    }

    static async readUser(context: AppLoadContext, request: Request) {
        let sessionStorage = new SessionStorage(context);
        let session = await sessionStorage.read(request.headers.get("cookie"));
        return session.get("user")
    }

    static async requireUser(context: AppLoadContext, request: Request, returnTo = "/auth/login") {
        let user = await this.readUser(context, request);
        if (!user) throw redirect(returnTo)
        return user;
    }
}