import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { GoogleMapsContext, useMapsLibrary } from '@vis.gl/react-google-maps'

import type { Ref } from 'react'

type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onDrag?: (e: google.maps.MapMouseEvent) => void
  onDragStart?: (e: google.maps.MapMouseEvent) => void
  onDragEnd?: (e: google.maps.MapMouseEvent) => void
  onMouseOver?: (e: google.maps.MapMouseEvent) => void
  onMouseOut?: (e: google.maps.MapMouseEvent) => void
}

type PolylineCustomProps = {
  /**
   * this is an encoded string for the path, will be decoded and used as a path
   */
  encodedPath?: string
}

export type PolylineProps = google.maps.PolylineOptions &
  PolylineEventProps &
  PolylineCustomProps

export type PolylineRef = Ref<google.maps.Polyline | null>

function usePolyline(props: PolylineProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPath,
    ...polylineOptions
  } = props

  const callbacks = useRef<Record<string, (e: unknown) => void>>({})
  // eslint-disable-next-line react-compiler/react-compiler
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
  })

  const geometryLibrary = useMapsLibrary('geometry')
  const map = useContext(GoogleMapsContext)?.map
  const polylineRef = useRef<google.maps.Polyline | null>(null)

  // Initialize the polyline instance only once after the component mounts
  useEffect(() => {
    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline()
    }
    return () => {
      // Cleanup the polyline when the component unmounts
      polylineRef.current?.setMap(null)
    }
  }, [])

  // Update polyline options
  useEffect(() => {
    const polyline = polylineRef.current
    if (!polyline) return

    polyline.setOptions(polylineOptions)
  }, [polylineOptions])

  // Update the path with the encodedPath
  useEffect(() => {
    const polyline = polylineRef.current
    if (!polyline || !encodedPath || !geometryLibrary) return
    const path = geometryLibrary.encoding.decodePath(encodedPath)
    polyline.setPath(path)
  }, [encodedPath, geometryLibrary])

  // Attach the polyline to the map
  useEffect(() => {
    const polyline = polylineRef.current
    if (!map || !polyline) {
      if (map === undefined)
        console.error('<Polyline> has to be inside a Map component.')
      return
    }

    polyline.setMap(map)

    return () => {
      polyline.setMap(null)
    }
  }, [map])

  // Attach event handlers
  useEffect(() => {
    const polyline = polylineRef.current
    if (!polyline) return

    const gme = google.maps.event
    ;[
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut'],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polyline, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback]
        if (callback) callback(e)
      })
    })

    return () => {
      gme.clearInstanceListeners(polyline)
    }
  }, [polylineOptions])

  return polylineRef
}

/**
 * Component to render a polyline on a map
 */
export const Polyline = forwardRef((props: PolylineProps, ref: PolylineRef) => {
  const polylineRef = usePolyline(props)

  useImperativeHandle(ref, () => polylineRef.current, [polylineRef])

  return null
})

Polyline.displayName = 'Polyline'
