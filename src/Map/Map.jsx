import { MapContainer, TileLayer, useMap, Polyline, Marker, Popup } from "react-leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";
import icon from "../Images/icon.png";
import L from "leaflet";

export default function Map({ route }) {
  
  // console.log(latitude);
  // console.log(longitude);
  // console.log(longitude );
  // const { lat, long } = coords;

  const customIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [25, 35],
    iconAnchor: [5, 30]
  });

  function MapView() {
    let map = useMap();
    map.setView([route[0].lat, route[0].lng], map.getZoom());

    return null;
  }

  return (
    <MapContainer
      classsName="map"
      center={[route[0].lat, route[0].lng]}
      zoom={5}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
        contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapView />
      {route.length > 1 && <Polyline positions={route.map((coords) => [coords.lat, coords.lng])} />}
      {route.map((coords, index) => (
        <Marker position={[coords.lat, coords.lng]} key={index}>
          <Popup>{index+1}. {coords.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
