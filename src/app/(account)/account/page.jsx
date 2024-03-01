import Layout from '../../layouts/account-layout';
import Client from './page.client';
import { Suspense } from 'react';
import Loading from '../../loading';
import {getUserDataSelf, getUserSelf} from "../../../utils/actions/user-actions";

export const metadata = {
  title: 'Account Settings',
};

export default async function AccountSettings() {
  const userDataSelf = await getUserDataSelf();
  const userSelf = await getUserSelf();
  const userId = userDataSelf.$id;
  
  return (
      <>
        <Layout>
          <Suspense fallback={<Loading/>}>
            <Client userDataSelf={userDataSelf} userSelf={userSelf} userId={userId}/>
          </Suspense>
        </Layout>
      </>
  );
}
