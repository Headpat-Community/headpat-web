'use server';
import { headers } from 'next/headers';

export async function getGallery(query = '') {
	const headersList = headers();
	const cookieHeader = headersList.get('cookie');

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655cb829dbf6102f2436/documents?${query}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
				'X-Appwrite-Response-Format': '1.4.0',
				Cookie: cookieHeader,
			},
		});

	if (!response.ok) {
		return false;
	}

	return await response.json();
}

export async function getSingleGallery(galleryId) {
	const headersList = headers();
	const cookieHeader = headersList.get('cookie');

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655cb829dbf6102f2436/documents/${galleryId}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
				'X-Appwrite-Response-Format': '1.4.0',
				Cookie: cookieHeader,
			},
		});

	if (!response.ok) {
		return false;
	}

	return await response.json();
}

export async function deleteGalleryImage(imageId) {
	const headersList = headers();
	const cookieHeader = headersList.get('cookie');

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files/${imageId}`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
				'X-Appwrite-Response-Format': '1.4.0',
				Cookie: cookieHeader,
			},
		});

	return response.ok;
}

export async function deleteGalleryDocument(documentId) {
	const headersList = headers();
	const cookieHeader = headersList.get('cookie');

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655cb829dbf6102f2436/documents/${documentId}`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
				'X-Appwrite-Response-Format': '1.4.0',
				Cookie: cookieHeader,
			},
		});

	return response.ok;
}