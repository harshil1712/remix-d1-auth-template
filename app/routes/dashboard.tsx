import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { SessionStorage } from "~/services/session.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Dashboard | Remix Cloudflare D1 Auth Demo" },
        {
            name: "description",
            content: "Welcome to Remix on Cloudflare!",
        },
    ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    let user = await SessionStorage.requireUser(context, request);
    return json(user)
}

export default function Dashboard() {
    const user = useLoaderData<typeof loader>();
    return (
        <main>
            <h1>Dashboard</h1>
            <h2>Welcome {user.name}</h2>
            <img src={user.avatar} alt={`Avatar of ${user.name}`} />
            <Link to="/auth/logout">Logout</Link>
        </main>
    )
}