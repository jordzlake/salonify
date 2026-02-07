"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import so Leaflet only renders on client
const MapLeaflet = dynamic(() => import("./MapLeaflet"), { ssr: false });

import { salons } from "../data/salons";
import { startingPoint } from "../data/startLocation";

export default function MapView() {
  const [radius, setRadius] = useState(500);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>Appointment Date:</label>
        <input
          type="date"
          value={selectedDate.toISOString().slice(0, 10)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
        <label>Radius (m):</label>
        <input
          type="range"
          min="100"
          max="10000"
          step="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <span>{radius} m</span>
      </div>

      <MapLeaflet
        salons={salons}
        startingPoint={startingPoint}
        radius={radius}
        selectedDate={selectedDate}
      />
    </div>
  );
}
