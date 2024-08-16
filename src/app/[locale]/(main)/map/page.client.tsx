'use client'
import React, { useEffect, useState } from 'react'
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Events, Location, UserData } from '@/utils/types/models'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate } from '@/components/calculateTimeLeft'
import { getDocument, listDocuments } from '@/components/api/documents'
import { toast } from 'sonner'
import { client, Query } from '@/app/appwrite-client'
import { Polygon } from '@/components/map/polygon'
import { Circle } from '@/components/map/circle'

export default function PageClient() {
  const [events, setEvents] = useState<Events.EventsType>(null)
  const [friendsLocations, setFriendsLocations] = useState(null)
  const [filters, setFilters] = useState({
    showEvents: true,
    showFriends: true,
    showCommunity: true,
  })

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
      //if (user?.current?.$id) {
      //  query = [Query.notEqual('$id', user?.current?.$id)]
      //}
      const data: Location.LocationType = await listDocuments(
        'hp_db',
        'locations',
        query
      )

      const promises = data.documents.map(async (doc) => {
        const userData: UserData.UserDataDocumentsType = await getDocument(
          'hp_db',
          'userdata',
          `${doc.$id}`
        )
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
          case 'create':
            // Fetch userData for the updated or created document
            const userData: UserData.UserDataDocumentsType = await getDocument(
              'hp_db',
              'userdata',
              `${updatedDocument.$id}`
            )
            const updatedLocationWithUserData = { ...updatedDocument, userData }

            setFriendsLocations(
              (prevLocations: Location.LocationDocumentsType[]) => {
                const locationExists = prevLocations.some(
                  (location) => location.$id === updatedDocument.$id
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
          case 'delete':
            // Remove the deleted document from the state
            setFriendsLocations(
              (prevLocations: Location.LocationDocumentsType[]) =>
                prevLocations.filter(
                  (location) => location.$id !== updatedDocument.$id
                )
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
    return `https://api.headpat.de/v1/storage/buckets/avatars/files/${avatarId}/preview?project=6557c1a8b6c2739b3ecf&width=100&height=100`
  }

  return (
    <div className={'h-[90vh] w-full'}>
      <Dialog
        open={modalUserOpen}
        onOpenChange={(open) => setModalUserOpen(open)}
      >
        <DialogContent>
          <DialogTitle>{currentUser.title}</DialogTitle>
          <span>Status: {currentUser.status}</span>
          <DialogDescription>{currentUser.description}</DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalEventOpen}
        onOpenChange={(open) => setModalEventOpen(open)}
      >
        <DialogContent>
          <DialogTitle>{currentEvent?.title}</DialogTitle>
          <DialogDescription>{currentEvent?.description}</DialogDescription>
          <DialogFooter>
            <div>Start: {formatDate(new Date(currentEvent?.date))}</div>
            <div>Until: {formatDate(new Date(currentEvent?.dateUntil))}</div>
          </DialogFooter>
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
          {friendsLocations?.map((user, index) => {
            return (
              <AdvancedMarker
                key={index}
                position={{ lat: user.lat, lng: user.long }}
                title={'AdvancedMarker with custom html content.'}
                onClick={() => (
                  setCurrentUser({
                    title: user.userData?.displayName,
                    status: user.userData?.status,
                    description: user.userData?.bio,
                  }),
                  setModalUserOpen(true)
                )}
              >
                <Avatar>
                  <AvatarImage src={getUserAvatar(user?.userData?.avatarId)} />
                  <AvatarFallback>CN</AvatarFallback>
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
              console.log(coords)
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
