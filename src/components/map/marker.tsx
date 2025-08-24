import React, { useState, useCallback, memo } from "react"
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps"

// Memoized marker position to prevent unnecessary recalculations
const MARKER_POSITION = { lat: 28, lng: -82 } as const

// Memoized marker title to prevent recreation
const MARKER_TITLE = "AdvancedMarker that opens an Infowindow when clicked."

// Memoized info window content to prevent recreation
const InfoWindowContent = memo(() => (
  <>
    This is an example for the{" "}
    <code style={{ whiteSpace: "nowrap" }}>&lt;AdvancedMarker /&gt;</code>{" "}
    combined with an Infowindow.
  </>
))

InfoWindowContent.displayName = "InfoWindowContent"

export const MarkerWithInfowindow = memo(function MarkerWithInfowindow() {
  const [infowindowOpen, setInfowindowOpen] = useState(true)
  const [markerRef, marker] = useAdvancedMarkerRef()

  // Memoize click handler to prevent unnecessary re-renders
  const handleMarkerClick = useCallback(() => {
    setInfowindowOpen(true)
  }, [])

  // Memoize close handler to prevent unnecessary re-renders
  const handleCloseClick = useCallback(() => {
    setInfowindowOpen(false)
  }, [])

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={handleMarkerClick}
        position={MARKER_POSITION}
        title={MARKER_TITLE}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={handleCloseClick}
          className={"text-black"}
        >
          <InfoWindowContent />
        </InfoWindow>
      )}
    </>
  )
})
