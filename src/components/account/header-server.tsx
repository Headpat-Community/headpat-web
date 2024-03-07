import HeaderClient from "./header";
import AnnouncementNotification from "../announcementNotification";
import { getAccount } from "@/utils/actions/user-actions";
import { getAnnouncements } from "@/utils/actions/announcement-actions";
import { AnnouncementDataType, AnnouncementDocumentsType } from "@/utils/types";

export default async function Header({ children }) {
  const jwtBool: boolean = await getAccount();
  let announcementData: AnnouncementDataType = await getAnnouncements();
  let selectedAnnouncement: AnnouncementDocumentsType | undefined;

  // sort the data by date
  if (announcementData.documents) {
    announcementData.documents.sort((a, b) => {
      return (
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
    });

    selectedAnnouncement = announcementData.documents.find((announcement) => {
      const validUntil = new Date(announcement.validUntil);
      return !validUntil || validUntil > new Date();
    });
  }

  return (
    <div>
      <HeaderClient>{children}</HeaderClient>
    </div>
  );
}
