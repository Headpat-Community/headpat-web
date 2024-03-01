import Client from './page.client';
import { getUserData, getUserSelf, } from '../../../../utils/actions/user-actions';
import { getGallery } from '../../../../utils/actions/gallery-actions';
import { notFound } from "next/navigation";

export const runtime = 'edge';

export const metadata = {
	title: 'Gallerie',
	description: 'Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.',
};

export default async function Gallery({params: {galleryId}}) {
	const userSelf = await getUserSelf();
	const gallery = await getGallery(`queries[]=equal("$id","${galleryId}")`);
	const galleryData = gallery.documents[0];
	const userId = galleryData?.userId;
	const userDataUrl = `queries[]=equal("$id","${userId}")`;
	const userData = await getUserData(userDataUrl);

	if (!userId) {
		return notFound();
	}
  
	return (
		<div>
			<Client
				userData={userData[0]}
				gallery={galleryData}
				userSelf={userSelf}
			/>
		</div>
	);
}
