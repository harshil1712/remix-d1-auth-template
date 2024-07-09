import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Auth } from "~/services/auth.server";

export async function loader() {
    return redirect("/auth/login")
}

export async function action({ request, params, context }: ActionFunctionArgs) {
    let provider = params.provider as string;
    let auth = new Auth(context)
    return await auth.authenticate(provider, request, {
        successRedirect: `/auth/${provider}/callback`,
        failureRedirect: '/auth/login'
    })
}