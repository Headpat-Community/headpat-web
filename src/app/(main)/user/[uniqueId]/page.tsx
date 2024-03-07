import Client from './page.client';

export const runtime = 'edge';

export const metadata = {
  title: 'User Profile',
  description: 'User Profile Description',
};

export default function UserProfile() {
  return (
      <>
        <Client/>
      </>
  );
}
