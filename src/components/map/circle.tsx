import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import type { Ref } from 'react'
import { GoogleMapsContext, latLngEquals } from '@vis.gl/react-google-maps'

type CircleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onDrag?: (e: google.maps.MapMouseEvent) => void
  onDragStart?: (e: google.maps.MapMouseEvent) => void
  onDragEnd?: (e: google.maps.MapMouseEvent) => void
  onMouseOver?: (e: google.maps.MapMouseEvent) => void
  onMouseOut?: (e: google.maps.MapMouseEvent) => void
  onRadiusChanged?: (r: ReturnType<google.maps.Circle['getRadius']>) => void
  onCenterChanged?: (p: ReturnType<google.maps.Circle['getCenter']>) => void
}

export type CircleProps = google.maps.CircleOptions & CircleEventProps

export type CircleRef = Ref<google.maps.Circle | null>

function useCircle(props: CircleProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
    radius,
    center,
    ...circleOptions
  } = props

  const callbacks = useRef<Record<string, (e: unknown) => void>>({})
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
  })

  const circleRef = useRef<google.maps.Circle | null>(null)
  const map = useContext(GoogleMapsContext)?.map

  // Initialize the circle instance only once after the component mounts
  useEffect(() => {
    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle()
    }
    return () => {
      // Cleanup the circle when the component unmounts
      circleRef.current?.setMap(null)
    }
  }, [])

  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return

    // Update circle options
    circle.setOptions(circleOptions)

    // Update center
    if (center && !latLngEquals(center, circle.getCenter())) {
      circle.setCenter(center)
    }

    // Update radius
    if (radius !== undefined && radius !== circle.getRadius()) {
      circle.setRadius(radius)
    }
  }, [center, radius, circleOptions])

  // Attach to the map when available
  useEffect(() => {
    const circle = circleRef.current
    if (!map || !circle) {
      if (map === undefined)
        console.error('<Circle> has to be inside a Map component.')
      return
    }

    circle.setMap(map)

    return () => {
      circle.setMap(null)
    }
  }, [map])

  // Attach and re-attach event handlers when properties change
  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return

    const gme = google.maps.event
    ;[
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut'],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(circle, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback]
        if (callback) callback(e)
      })
    })
    gme.addListener(circle, 'radius_changed', () => {
      const newRadius = circle.getRadius()
      callbacks.current.onRadiusChanged?.(newRadius)
    })
    gme.addListener(circle, 'center_changed', () => {
      const newCenter = circle.getCenter()
      callbacks.current.onCenterChanged?.(newCenter)
    })

    return () => {
      gme.clearInstanceListeners(circle)
    }
  }, [circleOptions])

  return circleRef
}

/**
 * Component to render a circle on a map
 */
export const Circle = forwardRef((props: CircleProps, ref: CircleRef) => {
  const circleRef = useCircle(props)

  useImperativeHandle(ref, () => circleRef.current)

  return null
})

Circle.displayName = 'Circle'
