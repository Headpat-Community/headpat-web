'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Events, Location, UserData } from '@/utils/types/models'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDateLocale } from '@/components/calculateTimeLeft'
import { getDocument, listDocuments } from '@/components/api/documents'
import { toast } from 'sonner'
import { client, databases, Query } from '@/app/appwrite-client'
import { Polygon } from '@/components/map/polygon'
import { Circle } from '@/components/map/circle'
import sanitizeHtml from 'sanitize-html'
import { useUser } from '@/components/contexts/UserContext'

type User = {
  lat: number
  long: number
  status: string
  statusColor: string
  userData: UserData.UserDataDocumentsType
}

export default function PageClient() {
  const [events, setEvents] = useState<Events.EventsType>(null)
  const [filters, setFilters] = useState({
    showEvents: true,
    showUsers: true,
  })
  const [friendsLocations, setFriendsLocations] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState(null)
  const [userStatus, setUserStatus] =
    useState<Location.LocationDocumentsType>(null)

  const { current } = useUser()

  const [currentUser, setCurrentUser] = useState({
    title: 'Nothing selected..',
    status: '',
    description: 'Please select a user on the map.',
  })
  const [currentEvent, setCurrentEvent] = useState({
    title: 'Nothing selected..',
    description: 'Please select an event on the map.',
    date: '',
    dateUntil: '',
  })
  const [modalUserOpen, setModalUserOpen] = useState<boolean>(false)
  const [modalEventOpen, setModalEventOpen] = useState<boolean>(false)

  const fetchEvents = async () => {
    try {
      const currentDate = new Date()

      const data: Events.EventsType = await listDocuments('hp_db', 'events', [
        Query.orderAsc('date'),
        Query.greaterThanEqual('dateUntil', currentDate.toISOString()),
        Query.or([
          Query.equal('locationZoneMethod', 'circle'),
          Query.equal('locationZoneMethod', 'polygon'),
        ]),
      ])

      setEvents(data)
    } catch (error) {
      toast('Failed to fetch events. Please try again later.')
    }
  }

  const fetchUserLocations = async () => {
    try {
      let query = []
      /*
       if (current?.$id) {
       query = [Query.notEqual('$id', current?.$id)]
       }
       */

      const data: Location.LocationType = await databases.listDocuments(
        'hp_db',
        'locations',
        query
      )

      const promises = data.documents.map(async (doc) => {
        if (current?.$id === doc.$id) {
          setUserStatus(doc)
          return
        }
        const userData: UserData.UserDataDocumentsType =
          await databases.getDocument('hp_db', 'userdata', doc.$id)
        return { ...doc, userData }
      })

      const results = await Promise.all(promises)
      setFriendsLocations(results)
    } catch (error) {
      toast('Failed to fetch locations. Please try again later.')
    }
  }

  const onRefresh = () => {
    fetchUserLocations().then()
    fetchEvents().then()
  }

  let locationsSubscribed = null
  useEffect(() => {
    onRefresh()
    handleSubscribedEvents()
    return () => {
      // Remove the event listener when the component is unmounted
      locationsSubscribed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsSubscribed])

  function handleSubscribedEvents() {
    locationsSubscribed = client.subscribe(
      ['databases.hp_db.collections.locations.documents'],
      async (response) => {
        const eventType = response.events[0].split('.').pop()
        const updatedDocument: any = response.payload

        switch (eventType) {
          case 'update':
            if (current && updatedDocument.$id === current.$id) {
              setUserStatus(updatedDocument)
              return
            }

            setFriendsLocations(
              (prevLocations: Location.LocationDocumentsType[]) => {
                const existingLocation = prevLocations.find(
                  (location) => location?.$id === updatedDocument.$id
                )
                if (existingLocation) {
                  // Merge updated document with existing one, preserving userData
                  return prevLocations.map((location) =>
                    location?.$id === updatedDocument.$id
                      ? {
                          ...location,
                          ...updatedDocument,
                          userData: location.userData,
                        }
                      : location
                  )
                } else {
                  return [...prevLocations, updatedDocument]
                }
              }
            )
            break
          case 'delete':
            if (current && updatedDocument.$id === current.$id) {
              setUserStatus(null)
              return
            }
            setFriendsLocations(
              (prevLocations: Location.LocationDocumentsType[]) => {
                return prevLocations.filter(
                  (location) => location?.$id !== updatedDocument.$id
                )
              }
            )
            break
          case 'create':
            if (current && updatedDocument.$id === current.$id) {
              setUserStatus(updatedDocument)
              return
            }

            const userData: UserData.UserDataDocumentsType =
              await databases.getDocument(
                'hp_db',
                'userdata',
                `${updatedDocument.$id}`
              )
            const updatedLocationWithUserData = { ...updatedDocument, userData }

            setFriendsLocations(
              (prevLocations: Location.LocationDocumentsType[]) => {
                const locationExists = prevLocations.some(
                  (location) => location?.$id === updatedDocument.$id
                )
                if (locationExists) {
                  // Update existing location
                  return prevLocations.map((location) =>
                    location.$id === updatedDocument.$id
                      ? updatedLocationWithUserData
                      : location
                  )
                } else {
                  // Add new location
                  return [...prevLocations, updatedLocationWithUserData]
                }
              }
            )
            break
          default:
            console.error('Unknown event type:', eventType)
        }
      }
    )
  }

  const getUserAvatar = (avatarId: string) => {
    if (!avatarId) return
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${avatarId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=100&height=100`
  }

  const sanitizedDescription = useMemo(() => {
    if (!currentEvent?.description) return ''
    return currentEvent.description.replace(/<[^>]*>?/gm, '')
  }, [currentEvent])

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
          <DialogDescription>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizedDescription || 'Nothing here yet!',
              }}
            />
          </DialogDescription>
          <div>Start: {formatDateLocale(new Date(currentEvent?.date))}</div>
          <div>
            Until: {formatDateLocale(new Date(currentEvent?.dateUntil))}
          </div>
        </DialogContent>
      </Dialog>

      <APIProvider apiKey={'AIzaSyDRkaXuz3k7vlbouwfZKpKH4KUgBtgJZOM'}>
        <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={3}
          defaultCenter={{ lat: 12, lng: 0 }}
          gestureHandling={'greedy'}
          disableDefaultUI
        >
          {friendsLocations?.map((user: User, index: number) => {
            return (
              <AdvancedMarker
                key={index}
                position={{ lat: user.lat, lng: user.long }}
                onClick={() => (
                  setCurrentUser({
                    title: user.userData?.displayName,
                    status: user.userData?.status,
                    description: user.userData?.bio,
                  }),
                  setModalUserOpen(true)
                )}
              >
                <Avatar
                  style={{
                    borderWidth: 2,
                    borderColor: user?.statusColor,
                  }}
                >
                  <AvatarImage src={getUserAvatar(user?.userData?.avatarId)} />
                  <AvatarFallback>
                    {user?.userData?.displayName
                      ? user?.userData?.displayName.charAt(0)
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
              </AdvancedMarker>
            )
          })}
          {events?.documents.map((event, index) => {
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
                  onClick={() => (
                    setCurrentEvent({
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      dateUntil: event.dateUntil,
                    }),
                    setModalEventOpen(true)
                  )}
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
                    lng: centerLongitude,
                  }}
                  radius={event?.circleRadius} // specify the radius here
                  fillColor="rgba(100, 200, 200, 0.5)" // optional, fill color of the circle
                  strokeColor="rgba(255,0,0,0.5)" // optional, border color of the circle
                  onClick={() => (
                    setCurrentEvent({
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      dateUntil: event.dateUntil,
                    }),
                    setModalEventOpen(true)
                  )}
                />
              )
            }
          })}
        </Map>
      </APIProvider>
    </div>
  )
}
