import HeaderClient from './header';
import AnnouncementNotification from '../announcementNotification';
import {getAccount} from 'utils/actions/user-actions';
import {getAnnouncements} from 'utils/actions/announcement-actions';
import {AnnouncementDataType, AnnouncementDocumentsType} from "utils/types";

export default async function Header() {
    const jwtBool = await getAccount();
    let announcementData: AnnouncementDataType = await getAnnouncements();

    return (
        <div>
            <AnnouncementNotification announcementData={announcementData.documents[0]}/>
            <HeaderClient jwtBool={jwtBool}/>
        </div>
    );
}