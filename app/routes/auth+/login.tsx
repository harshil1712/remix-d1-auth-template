import { json, type MetaFunction, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare"
import { Form } from "@remix-run/react"
import { SessionStorage } from "~/services/session.server"

export const meta: MetaFunction = () => {
    return [
        { title: "Login | Remix Cloudflare D1 Auth Demo" },
        {
            name: "description",
            content: "Welcome to Remix on Cloudflare!",
        },
    ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    let user = await SessionStorage.readUser(context, request)
    if (!user) return json(null)
    throw redirect("/dashboard")
}

export default function Login() {
    return (
        <Form action="/auth/github" method="POST">
            <button type="submit">Login with GitHub</button>
        </Form>
    )
}