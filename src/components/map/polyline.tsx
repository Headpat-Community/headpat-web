import {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"

import { GoogleMapsContext, useMapsLibrary } from "@vis.gl/react-google-maps"

import type { Ref } from "react"

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

// Memoized event mapping to prevent recreation
const EVENT_MAPPINGS = [
  ["click", "onClick"],
  ["drag", "onDrag"],
  ["dragstart", "onDragStart"],
  ["dragend", "onDragEnd"],
  ["mouseover", "onMouseOver"],
  ["mouseout", "onMouseOut"],
] as const

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

  // Memoize callbacks to prevent unnecessary re-renders
  const callbacks = useMemo(
    () => ({
      onClick,
      onDrag,
      onDragStart,
      onDragEnd,
      onMouseOver,
      onMouseOut,
    }),
    [onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut]
  )

  const geometryLibrary = useMapsLibrary("geometry")
  const map = useContext(GoogleMapsContext)?.map
  const polylineRef = useRef<google.maps.Polyline | null>(null)

  // Memoize decoded path to prevent unnecessary recalculations
  const decodedPath = useMemo(() => {
    if (!encodedPath || !geometryLibrary) return null
    return geometryLibrary.encoding.decodePath(encodedPath)
  }, [encodedPath, geometryLibrary])

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

  // Update polyline options with memoized dependencies
  useEffect(() => {
    const polyline = polylineRef.current
    if (!polyline) return

    polyline.setOptions(polylineOptions)
  }, [polylineOptions])

  // Update the path with the decoded path
  useEffect(() => {
    const polyline = polylineRef.current
    if (!polyline || !decodedPath) return
    polyline.setPath(decodedPath)
  }, [decodedPath])

  // Attach the polyline to the map
  useEffect(() => {
    const polyline = polylineRef.current
    if (!map || !polyline) {
      if (map === undefined)
        console.error("<Polyline> has to be inside a Map component.")
      return
    }

    polyline.setMap(map)

    return () => {
      polyline.setMap(null)
    }
  }, [map])

  // Memoized event handler setup to prevent unnecessary re-attachments
  const setupEventHandlers = useCallback(() => {
    const polyline = polylineRef.current
    if (!polyline) return

    const gme = google.maps.event

    // Setup event listeners
    EVENT_MAPPINGS.forEach(([eventName, eventCallback]) => {
      gme.addListener(polyline, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks[eventCallback as keyof typeof callbacks] as
          | ((e: google.maps.MapMouseEvent) => void)
          | undefined
        if (callback) callback(e)
      })
    })

    return () => {
      gme.clearInstanceListeners(polyline)
    }
  }, [callbacks])

  // Attach event handlers
  useEffect(() => {
    return setupEventHandlers()
  }, [setupEventHandlers])

  return polylineRef
}

/**
 * Component to render a polyline on a map
 */
export const Polyline = memo(
  forwardRef((props: PolylineProps, ref: PolylineRef) => {
    const polylineRef = usePolyline(props)

    useImperativeHandle(ref, () => polylineRef.current!, [polylineRef])

    return null
  })
)

Polyline.displayName = "Polyline"
