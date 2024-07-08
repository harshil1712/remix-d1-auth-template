import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, Link, useLoaderData } from "@remix-run/react";
import { SessionStorage } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Cloudflare D1 Auth Demo" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  let user = await SessionStorage.readUser(context, request)
  if (!user) return json({ isAuth: false })
  return json({ isAuth: true })
}

export default function Index() {
  const { isAuth } = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix on Cloudflare</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
      </ul>
      {!isAuth && <Link to="/auth/login">Login</Link>}
    </div>
  );
}
