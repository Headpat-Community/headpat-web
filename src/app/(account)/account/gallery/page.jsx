import Client from "./page.client";
import { getUserSelf } from "../../../../utils/actions/user-actions";

export const runtime = "edge";

export const metadata = {
  title: "Account Gallery",
};

export default async function FetchGallery() {
  const userSelf = await getUserSelf();
  const userId = userSelf?.$id;
  let enableNsfw = userSelf?.enablensfw;

  return <Client enableNsfw={enableNsfw || false} userId={userId} />;
}
