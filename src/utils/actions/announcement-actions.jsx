'use server';
import { headers } from 'next/headers';

export async function getAnnouncements() {
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');

  const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564499f223ba3233ca/documents`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          'X-Appwrite-Response-Format': '1.4.0',
          Cookie: cookieHeader,
        },
        next: {
          revalidate: 5,
        },
      }).then((response) => response.json());

  return response;
}

export async function getAnnouncement(announcementId) {
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');

  const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564499f223ba3233ca/documents/${announcementId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          'X-Appwrite-Response-Format': '1.4.0',
          Cookie: cookieHeader,
        },
        next: {
          revalidate: 3600,
        },
      }).then((response) => response.json());

  if (response.code === 404) {
    return false;
  }

  return response;
}