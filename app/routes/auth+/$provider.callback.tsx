import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Auth } from "~/services/auth.server";
import { SessionStorage } from "~/services/session.server";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    let provider = params.provider as string;
    let auth = new Auth(context);
    let user = await auth.authenticate(provider, request, {
        failureRedirect: "/auth/login",
    })

    let sessionStorage = new SessionStorage(context)

    let session = await sessionStorage.read(request.headers.get("cookie"));

    session.set('user', user)

    let headers = new Headers();

    headers.append("Set-Cookie", await sessionStorage.commit(session))
    headers.append("Set-Cookie", await auth.clear(request))

    throw redirect("/dashboard", { headers })

}