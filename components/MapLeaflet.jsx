"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { gsap } from "gsap";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Custom icons
const houseIcon = new L.Icon({
  iconUrl: "/home.svg",
  iconSize: [35, 35],
});

const salonIcon = new L.Icon({
  iconUrl: "/salon.svg",
  iconSize: [30, 30],
});

export default function MapLeaflet({
  salons,
  startingPoint,
  radius,
  selectedDate,
}) {
  const [visibleSalons, setVisibleSalons] = useState([]);
  const markersRef = useRef([]);
  const circleRef = useRef();
  const visibilityMapRef = useRef({});

  // Initialize all salons as invisible at start
  useEffect(() => {
    const initialMap = {};
    salons.forEach((s) => {
      initialMap[s.id] = false;
    });
    visibilityMapRef.current = initialMap;
  }, [salons]);

  useEffect(() => {
    const currentlyVisible = [];

    salons.forEach((s, i) => {
      const distance = getDistance(startingPoint, { lat: s.lat, lng: s.lng });
      const inRange = distance <= radius;

      if (inRange && !visibilityMapRef.current[s.id]) {
        // Fade in once
        if (markersRef.current[i]?._icon) {
          gsap.fromTo(
            markersRef.current[i]._icon,
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
          );
        }
        visibilityMapRef.current[s.id] = true;
      } else if (!inRange && visibilityMapRef.current[s.id]) {
        // Fade out
        if (markersRef.current[i]?._icon) {
          gsap.to(markersRef.current[i]._icon, { opacity: 0, duration: 0.3 });
        }
        visibilityMapRef.current[s.id] = false;
      }

      if (visibilityMapRef.current[s.id]) {
        currentlyVisible.push(s);
      }
    });

    setVisibleSalons(currentlyVisible);

    // Update circle radius
    if (circleRef.current?._radius) {
      circleRef.current.setRadius(radius);
    }
  }, [radius, selectedDate, salons]);

  function getDistance(p1, p2) {
    const R = 6371000;
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <MapContainer
      center={[startingPoint.lat, startingPoint.lng]}
      zoom={14}
      style={{ height: "600px", width: "100%" }}
      whenCreated={(map) => map.invalidateSize()}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker
        position={[startingPoint.lat, startingPoint.lng]}
        icon={houseIcon}
      >
        <Popup>Baby's House</Popup>
      </Marker>

      <Circle
        center={[startingPoint.lat, startingPoint.lng]}
        radius={radius}
        pathOptions={{ color: "pink", fillOpacity: 0.1 }}
        ref={circleRef}
      />

      {salons.map((s, i) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={salonIcon}
          ref={(el) => (markersRef.current[i] = el)}
          opacity={0} // initially hidden
        >
          <Popup>
            <strong>{s.name}</strong>
            <br />
            {s.address}
            <br />
            Rating: {s.rating} ({s.reviewsCount})
            <br />
            <a href={s.googleMapsUrl} target="_blank" rel="noreferrer">
              Google Maps
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
