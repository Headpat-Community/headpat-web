import HeaderClient from './header';
import AnnouncementNotification from '../announcementNotification';
import { getAccount } from '../../utils/actions/user-actions';
import { getAnnouncements } from '../../utils/actions/announcement-actions';

export default async function Header() {
  const jwtBool = await getAccount();
  let announcementData = await getAnnouncements();

  // sort the data by date
  if (announcementData.documents) {
    announcementData.documents.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    announcementData = announcementData.documents.find((announcement) => {
      const validUntil = new Date(announcement.validuntil);
      return !validUntil || validUntil > new Date();
    });
  }

  return (
      <div>
        <AnnouncementNotification announcementData={announcementData}/>
        <HeaderClient jwtBool={jwtBool}/>
      </div>
  );
}