"use client";
import {
  useLoadScript,
  GoogleMap,
  InfoWindow
} from "@react-google-maps/api";
import type { NextPage } from "next";
import React, { useMemo, useState, useEffect, useRef } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import styles from "../../css/Map.module.css";
import Header from "../../components/header";

const MapHeadpat: NextPage = () => {
  const [lat, setLat] = useState(53.56171391445263);
  const [lng, setLng] = useState(9.985976369494985);
  const [events, setEvents] = useState([]);
  const markerRef = useRef(null);

  useEffect(() => {
    // Fetch data from API and update state
    fetch("https://backend.headpat.de/api/publicmaps", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setEvents(data.data))
      .catch((error) => console.log(error));
  }, []);

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => {
    return events.length > 0
      ? {
          lat: events[0].attributes.latitude,
          lng: events[0].attributes.longitude,
        }
      : { lat: lat, lng: lng };
  }, [events, lat, lng]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true, // Add this line to enable zoom control
      gestureHandling: "cooperative", // Set this property to "cooperative"
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className={`${styles.homeWrapper}`}>
        <div className={`${styles.sidebar} pb-4`}>
          {/* render Places Auto Complete and pass custom handler which updates the state */}
          <PlacesAutocomplete
            onAddressSelect={(address) => {
              getGeocode({ address: address }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);

                setLat(lat);
                setLng(lng);
              });
            }}
          />
        </div>
        <GoogleMap
          options={mapOptions}
          zoom={2.5}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100vw", height: "90vh" }}
          onLoad={(map) => console.log("Map Loaded")}
        >
          {events.map((event, idx) => (
            <InfoWindow
              key={idx}
              position={{
                lat: event.attributes.latitude,
                lng: event.attributes.longitude,
              }}
            >
              <div
                className="text-black flex justify-center items-center bg-transparent"
              >
                <img
                  src="/logos/logo.png"
                  width={48}
                  alt={event.attributes.name}
                  className=""
                />
                <span className="pl-2">{event.attributes.name}</span>
              </div>
            </InfoWindow>
          ))}
        </GoogleMap>
      </div>
    </>
  );
};

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <input
        value={value}
        className={styles.autocompleteInput}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="123 Stariway To Heaven"
      />

      {status === "OK" && (
        <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
      )}
    </div>
  );
};

export default MapHeadpat;
