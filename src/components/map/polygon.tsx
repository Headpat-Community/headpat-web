import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef
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

  const callbacks = useRef<Record<string, (e: unknown) => void>>({})
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut
  })

  const geometryLibrary = useMapsLibrary('geometry')
  const map = useContext(GoogleMapsContext)?.map
  const polygonRef = useRef<google.maps.Polygon | null>(null)

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

  useEffect(() => {
    const polygon = polygonRef.current
    if (!polygon) return

    // Update polygon options
    polygon.setOptions(polygonOptions)
  }, [polygonOptions])

  // Update the path with the encodedPaths
  useEffect(() => {
    const polygon = polygonRef.current
    if (!polygon || !encodedPaths || !geometryLibrary) return
    const paths = encodedPaths.map((path) =>
      geometryLibrary.encoding.decodePath(path)
    )
    polygon.setPaths(paths)
  }, [encodedPaths, geometryLibrary])

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

  // Attach event handlers
  useEffect(() => {
    const polygon = polygonRef.current
    if (!polygon) return

    const gme = google.maps.event
    ;[
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut']
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polygon, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback]
        if (callback) callback(e)
      })
    })

    return () => {
      gme.clearInstanceListeners(polygon)
    }
  }, [polygonOptions])

  return polygonRef
}

/**
 * Component to render a polygon on a map
 */
export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
  const polygonRef = usePolygon(props)

  useImperativeHandle(ref, () => polygonRef.current, [polygonRef])

  return null
})

Polygon.displayName = 'Polygon'
