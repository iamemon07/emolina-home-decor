import { revalidatePath, revalidateTag } from "next/cache";
import { adminRoute, ok } from "@/lib/api";
import { TAGS } from "@/services/settings";

/** Clears all cached storefront data — useful after bulk imports or direct database edits. */
export const POST = adminRoute(async () => {
  Object.values(TAGS).forEach((t) => revalidateTag(t));
  revalidatePath("/", "layout");
  return ok({ refreshed: true });
});
