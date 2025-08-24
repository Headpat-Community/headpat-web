import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react"

import type { Ref } from "react"
import { GoogleMapsContext, latLngEquals } from "@vis.gl/react-google-maps"

type CircleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onDrag?: (e: google.maps.MapMouseEvent) => void
  onDragStart?: (e: google.maps.MapMouseEvent) => void
  onDragEnd?: (e: google.maps.MapMouseEvent) => void
  onMouseOver?: (e: google.maps.MapMouseEvent) => void
  onMouseOut?: (e: google.maps.MapMouseEvent) => void
  onRadiusChanged?: (r: ReturnType<google.maps.Circle["getRadius"]>) => void
  onCenterChanged?: (p: ReturnType<google.maps.Circle["getCenter"]>) => void
}

export type CircleProps = google.maps.CircleOptions & CircleEventProps

export type CircleRef = Ref<google.maps.Circle | null>

// Memoized event mapping to prevent recreation
const EVENT_MAPPINGS = [
  ["click", "onClick"],
  ["drag", "onDrag"],
  ["dragstart", "onDragStart"],
  ["dragend", "onDragEnd"],
  ["mouseover", "onMouseOver"],
  ["mouseout", "onMouseOut"],
] as const

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

  // Memoize callbacks to prevent unnecessary re-renders
  const callbacks = useMemo(
    () => ({
      onClick,
      onDrag,
      onDragStart,
      onDragEnd,
      onMouseOver,
      onMouseOut,
      onRadiusChanged,
      onCenterChanged,
    }),
    [
      onClick,
      onDrag,
      onDragStart,
      onDragEnd,
      onMouseOver,
      onMouseOut,
      onRadiusChanged,
      onCenterChanged,
    ]
  )

  const circleRef = useRef<google.maps.Circle | null>(null)
  const map = useContext(GoogleMapsContext)?.map

  // Memoize center comparison to prevent unnecessary updates
  const shouldUpdateCenter = useMemo(() => {
    if (!center || !circleRef.current) return false
    return !latLngEquals(center, circleRef.current.getCenter())
  }, [center])

  // Memoize radius comparison to prevent unnecessary updates
  const shouldUpdateRadius = useMemo(() => {
    if (radius === undefined || !circleRef.current) return false
    return radius !== circleRef.current.getRadius()
  }, [radius])

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

  // Update circle options with memoized dependencies
  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return

    // Update circle options
    circle.setOptions(circleOptions)

    // Update center only if needed
    if (shouldUpdateCenter && center) {
      circle.setCenter(center)
    }

    // Update radius only if needed
    if (shouldUpdateRadius) {
      circle.setRadius(radius!)
    }
  }, [circleOptions, shouldUpdateCenter, shouldUpdateRadius, center, radius])

  // Attach to the map when available
  useEffect(() => {
    const circle = circleRef.current
    if (!map || !circle) {
      if (map === undefined)
        console.error("<Circle> has to be inside a Map component.")
      return
    }

    circle.setMap(map)

    return () => {
      circle.setMap(null)
    }
  }, [map])

  // Memoized event handler setup to prevent unnecessary re-attachments
  const setupEventHandlers = useCallback(() => {
    const circle = circleRef.current
    if (!circle) return

    const gme = google.maps.event

    // Setup event listeners
    EVENT_MAPPINGS.forEach(([eventName, eventCallback]) => {
      gme.addListener(circle, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks[eventCallback as keyof typeof callbacks] as
          | ((e: google.maps.MapMouseEvent) => void)
          | undefined
        if (callback) callback(e)
      })
    })

    // Setup property change listeners
    gme.addListener(circle, "radius_changed", () => {
      const newRadius = circle.getRadius()
      callbacks.onRadiusChanged?.(newRadius)
    })

    gme.addListener(circle, "center_changed", () => {
      const newCenter = circle.getCenter()
      callbacks.onCenterChanged?.(newCenter)
    })

    return () => {
      gme.clearInstanceListeners(circle)
    }
  }, [callbacks])

  // Attach and re-attach event handlers when properties change
  useEffect(() => {
    return setupEventHandlers()
  }, [setupEventHandlers])

  return circleRef
}

/**
 * Component to render a circle on a map
 */
export const Circle = memo(
  forwardRef((props: CircleProps, ref: CircleRef) => {
    const circleRef = useCircle(props)

    useImperativeHandle(ref, () => circleRef.current, [circleRef])

    return null
  })
)

Circle.displayName = "Circle"
