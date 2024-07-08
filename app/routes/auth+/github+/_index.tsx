import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Auth } from "~/services/auth.server";

export async function loader() {
    return redirect("/auth/login")
}

export async function action({ request, context }: ActionFunctionArgs) {
    let auth = new Auth(context)
    return await auth.authenticate("github", request, {
        successRedirect: '/auth/github/callback',
        failureRedirect: '/auth/login'
    })
}