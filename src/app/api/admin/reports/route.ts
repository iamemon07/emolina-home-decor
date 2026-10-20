import { adminRoute, ok } from "@/lib/api";
import { getFinanceReport } from "@/services/reports";

export const GET = adminRoute(
  async (req) => {
    const url = new URL(req.url);
    const now = new Date();
    const from = url.searchParams.get("from")
      ? new Date(`${url.searchParams.get("from")}T00:00:00`)
      : new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const to = url.searchParams.get("to") ? new Date(`${url.searchParams.get("to")}T23:59:59.999`) : now;
    return ok(await getFinanceReport({ from, to }));
  },
  { ownerOnly: true },
);
