import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { AppLoadContext, createCookieSessionStorage, SessionStorage } from "@remix-run/cloudflare";
import { connection } from "./db.server";
import { User } from "@prisma/client";

export class Auth {
    protected authenticator: Authenticator<User>;
    protected sessionStorage: SessionStorage;

    public authenticate: Authenticator["authenticate"];
    public isAuthenticated: Authenticator["isAuthenticated"];

    constructor(context: AppLoadContext) {
        this.sessionStorage = createCookieSessionStorage({
            cookie: {
                name: "sdx:auth",
                path: "/",
                maxAge: 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                secrets: [context.cloudflare.env.COOKIE_SESSION_SECRET],
            },
        });
        this.authenticator = new Authenticator(this.sessionStorage)

        this.authenticator.use(
            new GitHubStrategy({
                clientID: context.cloudflare.env.GITHUB_CLIENT_ID,
                clientSecret: context.cloudflare.env.GITHUB_CLIENT_SECRET,
                callbackURL: '/auth/github/callback'
            }, async ({ profile }) => {
                const db = await connection(context.cloudflare.env.DB)

                const { provider, emails, _json } = profile;
                const { login, avatar_url, name } = _json;
                let u = await db.user.findUnique({ where: { email: emails[0].value } });
                if (!u) {
                    u = await db.user.create({
                        data: {
                            email: emails[0].value,
                            provider: provider,
                            avatar: avatar_url,
                            name: name,
                            providerUserId: login
                        }
                    })
                }
                return u;
            })
        )
        this.authenticate = this.authenticator.authenticate.bind(this.authenticator)
        this.isAuthenticated = this.authenticator.isAuthenticated.bind(this.authenticator)
    }

    public async clear(request: Request) {
        let session = await this.sessionStorage.getSession(request.headers.get("cookie"));
        return this.sessionStorage.destroySession(session)
    }
}