'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { formatDateLocale } from '@/components/calculateTimeLeft'
import { listDocuments } from '@/components/api/documents'
import { toast } from 'sonner'
import { client, databases, Query } from '@/app/appwrite-client'
import { Polygon } from '@/components/map/polygon'
import { Circle } from '@/components/map/circle'
import sanitizeHtml from 'sanitize-html'
import { useUser } from '@/components/contexts/UserContext'
import FiltersModal from '@/components/map/FiltersModal'
import { Button } from '@/components/ui/button'
import { FilterIcon, SettingsIcon } from 'lucide-react'
import SettingsModal from '@/components/map/SettingsModal'
import {
  EventsDocumentsType,
  EventsType,
  LocationDocumentsType,
  LocationType,
  UserDataDocumentsType
} from '@/utils/types/models'

type User = {
  lat: number
  long: number
  status: string
  statusColor: string
  userData: UserDataDocumentsType
}

export default function PageClient() {
  const [events, setEvents] = useState<EventsType>(null)
  const [filters, setFilters] = useState({
    showEvents: true,
    showUsers: true
  })
  const [friendsLocations, setFriendsLocations] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [userStatus, setUserStatus] = useState<LocationDocumentsType>(null)

  const { current } = useUser()

  const [currentUser, setCurrentUser] = useState({
    title: 'Nothing selected..',
    status: '',
    description: 'Please select a user on the map.'
  })
  const [currentEvent, setCurrentEvent] = useState({
    title: 'Nothing selected..',
    description: 'Please select an event on the map.',
    date: '',
    dateUntil: ''
  })
  const [modalUserOpen, setModalUserOpen] = useState<boolean>(false)
  const [modalEventOpen, setModalEventOpen] = useState<boolean>(false)

  const fetchEvents = useCallback(async () => {
    try {
      const currentDate = new Date()

      const data: EventsType = await listDocuments('hp_db', 'events', [
        Query.orderAsc('date'),
        Query.greaterThanEqual('dateUntil', currentDate.toISOString()),
        Query.or([
          Query.equal('locationZoneMethod', 'circle'),
          Query.equal('locationZoneMethod', 'polygon')
        ])
      ])

      setEvents(data)
    } catch {
      toast('Failed to fetch events. Please try again later.')
    }
  }, [])

  const fetchUserLocations = useCallback(async () => {
    try {
      const query = []
      /*
       if (current?.$id) {
       query = [Query.notEqual('$id', current?.$id)]
       }
       */

      const data: LocationType = await databases.listDocuments(
        'hp_db',
        'locations',
        query
      )

      const promises = data.documents.map(async (doc) => {
        if (current && current.$id === doc.$id) {
          setUserStatus(doc)
        }
        const userData: UserDataDocumentsType = await databases.getDocument(
          'hp_db',
          'userdata',
          doc.$id
        )
        return { ...doc, userData }
      })

      const results = await Promise.all(promises)
      setFriendsLocations(results)
    } catch {
      toast('Failed to fetch locations. Please try again later.')
    }
  }, [current])

  const onRefresh = useCallback(async () => {
    await fetchUserLocations()
    await fetchEvents()
  }, [fetchUserLocations, fetchEvents])

  const handleSubscribedEvents = useCallback(() => {
    return client.subscribe(
      ['databases.hp_db.collections.locations.documents'],
      async (response) => {
        const eventType = response.events[0].split('.').pop()
        const updatedDocument: any = response.payload

        switch (eventType) {
          case 'update':
            if (current && updatedDocument.$id === current.$id) {
              setUserStatus(updatedDocument)
            }

            setFriendsLocations((prevLocations: LocationDocumentsType[]) => {
              const existingLocation = prevLocations.find(
                (location) => location?.$id === updatedDocument.$id
              )
              if (existingLocation) {
                return prevLocations.map((location) =>
                  location?.$id === updatedDocument.$id
                    ? {
                        ...location,
                        ...updatedDocument,
                        userData: location.userData
                      }
                    : location
                )
              } else {
                return [...prevLocations, updatedDocument]
              }
            })
            break
          case 'delete':
            if (current && updatedDocument.$id === current.$id) {
              setUserStatus(null)
            }
            setFriendsLocations((prevLocations: LocationDocumentsType[]) => {
              return prevLocations.filter(
                (location) => location?.$id !== updatedDocument.$id
              )
            })
            break
          case 'create':
            if (current && updatedDocument.$id === current.$id) {
              setUserStatus(updatedDocument)
            }

            const userData: UserDataDocumentsType = await databases.getDocument(
              'hp_db',
              'userdata',
              `${updatedDocument.$id}`
            )
            const updatedLocationWithUserData = { ...updatedDocument, userData }

            setFriendsLocations((prevLocations: LocationDocumentsType[]) => {
              const locationExists = prevLocations.some(
                (location) => location?.$id === updatedDocument.$id
              )
              if (locationExists) {
                return prevLocations.map((location) =>
                  location.$id === updatedDocument.$id
                    ? updatedLocationWithUserData
                    : location
                )
              } else {
                return [...prevLocations, updatedLocationWithUserData]
              }
            })
            break
          default:
            console.error('Unknown event type:', eventType)
        }
      }
    )
  }, [current])

  useEffect(() => {
    onRefresh().then()
    const locationsSubscribed = handleSubscribedEvents()
    return () => {
      locationsSubscribed()
    }
  }, [current, handleSubscribedEvents, onRefresh])

  const getUserAvatar = (avatarId: string) => {
    if (!avatarId) return
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${avatarId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=100&height=100`
  }

  const advancedMarkerClick = (user: User) => {
    setCurrentUser({
      title: user.userData?.displayName,
      status: user.status,
      description: user.userData?.bio
    })
    setModalUserOpen(true)
  }

  const polygonClick = (event: EventsDocumentsType) => {
    setCurrentEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      dateUntil: event.dateUntil
    })
    setModalEventOpen(true)
  }

  const circleClick = (event: EventsDocumentsType) => {
    setCurrentEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      dateUntil: event.dateUntil
    })
    setModalEventOpen(true)
  }

  const sanitizedDescription = sanitizeHtml(currentEvent?.description)

  return (
    <div className={'h-[90vh] w-full'}>
      <Dialog
        open={modalUserOpen}
        onOpenChange={(open) => setModalUserOpen(open)}
      >
        <DialogContent>
          <DialogTitle>{currentUser?.title}</DialogTitle>
          <span>Status: {currentUser?.status}</span>
          <DialogDescription>{currentUser?.description}</DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalEventOpen}
        onOpenChange={(open) => setModalEventOpen(open)}
      >
        <DialogContent>
          <DialogTitle>{currentEvent?.title}</DialogTitle>
          <DialogDescription
            dangerouslySetInnerHTML={{
              __html: sanitizedDescription || 'Nothing here yet!'
            }}
          />
          <div>Start: {formatDateLocale(new Date(currentEvent?.date))}</div>
          <div>
            Until: {formatDateLocale(new Date(currentEvent?.dateUntil))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters dialog */}
      <FiltersModal
        openModal={filtersOpen}
        setOpenModal={setFiltersOpen}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Settings dialog */}
      {userStatus && (
        <SettingsModal
          openModal={settingsOpen}
          setOpenModal={setSettingsOpen}
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          current={current}
        />
      )}

      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
        <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={3}
          defaultCenter={{ lat: 12, lng: 0 }}
          gestureHandling={'greedy'}
          disableDefaultUI
        >
          {filters.showUsers &&
            friendsLocations?.map((user: User, index: number) => {
              if (user?.lat && user?.long) {
                return (
                  <AdvancedMarker
                    key={index}
                    position={{ lat: user.lat, lng: user.long }}
                    onClick={() => advancedMarkerClick(user)}
                  >
                    <Avatar
                      style={{
                        borderWidth: 2,
                        borderColor: user?.statusColor
                      }}
                    >
                      <AvatarImage
                        src={getUserAvatar(user?.userData?.avatarId)}
                      />
                      <AvatarFallback>
                        {user?.userData?.displayName
                          ? user?.userData?.displayName.charAt(0)
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </AdvancedMarker>
                )
              }
            })}
          {filters.showEvents &&
            events?.documents.map((event, index) => {
              if (event?.locationZoneMethod === 'polygon') {
                const coords = event?.coordinates.map((coord) => {
                  const [lat, lng] = coord.split(',').map(Number)
                  return { lat, lng }
                })
                return (
                  <Polygon
                    key={index}
                    fillColor="rgba(100, 200, 200, 0.5)" // optional, fill color of the polygon
                    strokeColor="rgba(255,0,0,0.5)" // optional, border color of the polygon
                    paths={coords}
                    onClick={() => polygonClick(event)}
                  />
                )
              } else if (event?.locationZoneMethod === 'circle') {
                // Assuming the first coordinate is the center of the circle
                const [centerLatitude, centerLongitude] = event?.coordinates[0]
                  .split(',')
                  .map(Number)
                return (
                  <Circle
                    key={index}
                    center={{
                      lat: centerLatitude,
                      lng: centerLongitude
                    }}
                    radius={event?.circleRadius} // specify the radius here
                    fillColor="rgba(100, 200, 200, 0.5)" // optional, fill color of the circle
                    strokeColor="rgba(255,0,0,0.5)" // optional, border color of the circle
                    onClick={() => circleClick(event)}
                  />
                )
              }
            })}
        </Map>
      </APIProvider>
      <div
        className={
          'absolute top-[110px] sm:top-20 right-4 sm:right-8 rounded-full overflow-hidden'
        }
      >
        <Button
          className={
            'justify-center items-center bg-white h-14 w-14 rounded-full shadow-sm'
          }
          onClick={() => setFiltersOpen(true)}
        >
          <FilterIcon size={24} color={'black'} />
        </Button>
      </div>
      {userStatus && (
        <div
          style={{
            position: 'absolute',
            top: 160,
            right: 30,
            borderRadius: 50,
            overflow: 'hidden'
          }}
        >
          <Button
            className={
              'justify-center items-center bg-white h-14 w-14 rounded-full shadow-sm'
            }
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon size={24} color={'black'} />
          </Button>
        </div>
      )}
    </div>
  )
}
