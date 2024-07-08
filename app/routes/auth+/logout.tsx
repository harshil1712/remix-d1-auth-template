import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { SessionStorage } from "../../services/session.server"

export async function loader({ request, context }: LoaderFunctionArgs) {
    await SessionStorage.requireUser(context, request)
    return await SessionStorage.logout(context, request)
}