import Client from "./page.client";
import { getUserSelf } from "../../../../../utils/actions/user-actions";
import { getSingleGallery } from "../../../../../utils/actions/gallery-actions";
import { notFound } from "next/navigation";

export const runtime = "edge";

export const metadata = {
  title: "Account Gallery",
};

export default async function AccountSingleGalleryPage({
  params: { galleryId },
}) {
  const userSelf = await getUserSelf();
  const userId = userSelf?.$id;
  const singleGallery = await getSingleGallery(galleryId);
  const galleryUserId = singleGallery?.userId;

  if (!galleryUserId) return notFound(); // Wait for userId to be available
  if (!userId) return notFound(); // Wait for userId to be available

  if (userId !== galleryUserId) {
    return notFound();
  }

  if (!singleGallery) return notFound();

  return <Client singleGallery={singleGallery} />;
}
