import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  useMemo,
  memo
} from 'react'

import { GoogleMapsContext, useMapsLibrary } from '@vis.gl/react-google-maps'

import type { Ref } from 'react'

type PolygonEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onDrag?: (e: google.maps.MapMouseEvent) => void
  onDragStart?: (e: google.maps.MapMouseEvent) => void
  onDragEnd?: (e: google.maps.MapMouseEvent) => void
  onMouseOver?: (e: google.maps.MapMouseEvent) => void
  onMouseOut?: (e: google.maps.MapMouseEvent) => void
}

type PolygonCustomProps = {
  /**
   * this is an encoded string for the path, will be decoded and used as a path
   */
  encodedPaths?: string[]
}

export type PolygonProps = google.maps.PolygonOptions &
  PolygonEventProps &
  PolygonCustomProps

export type PolygonRef = Ref<google.maps.Polygon | null>

// Memoized event mapping to prevent recreation
const EVENT_MAPPINGS = [
  ['click', 'onClick'],
  ['drag', 'onDrag'],
  ['dragstart', 'onDragStart'],
  ['dragend', 'onDragEnd'],
  ['mouseover', 'onMouseOver'],
  ['mouseout', 'onMouseOut']
] as const

function usePolygon(props: PolygonProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPaths,
    ...polygonOptions
  } = props

  // Memoize callbacks to prevent unnecessary re-renders
  const callbacks = useMemo(
    () => ({
      onClick,
      onDrag,
      onDragStart,
      onDragEnd,
      onMouseOver,
      onMouseOut
    }),
    [onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut]
  )

  const geometryLibrary = useMapsLibrary('geometry')
  const map = useContext(GoogleMapsContext)?.map
  const polygonRef = useRef<google.maps.Polygon | null>(null)

  // Memoize decoded paths to prevent unnecessary recalculations
  const decodedPaths = useMemo(() => {
    if (!encodedPaths || !geometryLibrary) return null
    return encodedPaths.map((path) => geometryLibrary.encoding.decodePath(path))
  }, [encodedPaths, geometryLibrary])

  // Initialize the polygon instance only once after the component mounts
  useEffect(() => {
    if (!polygonRef.current) {
      polygonRef.current = new google.maps.Polygon()
    }
    return () => {
      // Cleanup the polygon when the component unmounts
      polygonRef.current?.setMap(null)
    }
  }, [])

  // Update polygon options with memoized dependencies
  useEffect(() => {
    const polygon = polygonRef.current
    if (!polygon) return

    // Update polygon options
    polygon.setOptions(polygonOptions)
  }, [polygonOptions])

  // Update the path with the decoded paths
  useEffect(() => {
    const polygon = polygonRef.current
    if (!polygon || !decodedPaths) return
    polygon.setPaths(decodedPaths)
  }, [decodedPaths])

  // Attach the polygon to the map
  useEffect(() => {
    const polygon = polygonRef.current
    if (!map || !polygon) {
      if (map === undefined)
        console.error('<Polygon> has to be inside a Map component.')
      return
    }

    polygon.setMap(map)

    return () => {
      polygon.setMap(null)
    }
  }, [map])

  // Memoized event handler setup to prevent unnecessary re-attachments
  const setupEventHandlers = useCallback(() => {
    const polygon = polygonRef.current
    if (!polygon) return

    const gme = google.maps.event

    // Setup event listeners
    EVENT_MAPPINGS.forEach(([eventName, eventCallback]) => {
      gme.addListener(polygon, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks[eventCallback as keyof typeof callbacks] as
          | ((e: google.maps.MapMouseEvent) => void)
          | undefined
        if (callback) callback(e)
      })
    })

    return () => {
      gme.clearInstanceListeners(polygon)
    }
  }, [callbacks])

  // Attach event handlers
  useEffect(() => {
    return setupEventHandlers()
  }, [setupEventHandlers])

  return polygonRef
}

/**
 * Component to render a polygon on a map
 */
export const Polygon = memo(
  forwardRef((props: PolygonProps, ref: PolygonRef) => {
    const polygonRef = usePolygon(props)

    useImperativeHandle(ref, () => polygonRef.current, [polygonRef])

    return null
  })
)

Polygon.displayName = 'Polygon'
