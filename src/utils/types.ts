/**
 * This data is returned from the API by calling their own account data.
 */
export interface User {
    $id: string;
    name: string;
    registration: Date;
    status: boolean;
    labels: string[];
    passwordUpdate: Date;
    email: string;
    phone: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    prefs: Record<string, unknown>;
    accessedAt: Date;
}

/**
 * This data is returned from the API by calling the userData function.
 */
export interface UserDataType {
    $id: string;
    status: string | null;
    birthday: Date | null;
    profileUrl: string;
    pronouns: string | null;
    discordname: string | null;
    telegramname: string | null;
    furaffinityname: string | null;
    X_name: string | null;
    twitchname: string | null;
    pats: number | 0;
    location: string | null;
    displayName: string;
    avatarId: string | null;
    bio: string | null;
    $createdAt: Date;
    $updatedAt: Date;
    $permissions: string[];
    $databaseId: string;
    $collectionId: string;
}

/**
 * This data is returned from the API within the `documents` array.
 * @see AnnouncementDataType
 * @see UserDataType
 * @interface
 * @since 2.0.0
 */
export interface AnnouncementDocumentsType {
    $id: string;
    title: string | null;
    sideText: string | null;
    description: string;
    validUntil: Date;
    userData: UserDataType;
    $createdAt: Date;
    $updatedAt: Date;
    $permissions: string[];
    $databaseId: string;
    $collectionId: string;
}

/**
 * This data is returned from the API by calling the getAnnouncements function.
 * @see AnnouncementDocumentsType
 */
export interface AnnouncementDataType {
    total: number;
    documents: AnnouncementDocumentsType[];
}