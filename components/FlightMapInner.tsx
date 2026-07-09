import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Flight } from '@/lib/types';

const planeIcon = L.divIcon({
  className: '',
  html: `<div style="font-size:22px;transform:rotate(45deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))">✈️</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const airportIcon = L.divIcon({
  className: '',
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#0E7C86;border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.2)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

export default function FlightMapInner({ flight }: { flight: Flight }) {
  const depLat = flight.departure.latitude;
  const depLon = flight.departure.longitude;
  const arrLat = flight.arrival.latitude;
  const arrLon = flight.arrival.longitude;

  if (depLat == null || depLon == null || arrLat == null || arrLon == null) {
    return (
      <div
        className="w-full h-56 rounded-2xl flex items-center justify-center text-sm text-muted"
        style={{ background: 'var(--border)' }}
      >
        Map unavailable for this route
      </div>
    );
  }

  const live = flight.live;
  const centerLat = live?.latitude ?? (depLat + arrLat) / 2;
  const centerLon = live?.longitude ?? (depLon + arrLon) / 2;
  const path: [number, number][] = [
    [depLat, depLon],
    ...(live ? [[live.latitude, live.longitude] as [number, number]] : []),
    [arrLat, arrLon],
  ];

  return (
    <div className="h-56 rounded-2xl overflow-hidden surface">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline positions={path} pathOptions={{ color: '#0E7C86', weight: 3, opacity: 0.85 }} />
        <Marker position={[depLat, depLon]} icon={airportIcon}>
          <Popup>{flight.departure.iata}</Popup>
        </Marker>
        <Marker position={[arrLat, arrLon]} icon={airportIcon}>
          <Popup>{flight.arrival.iata}</Popup>
        </Marker>
        {live && (
          <Marker position={[live.latitude, live.longitude]} icon={planeIcon}>
            <Popup>
              {flight.flightNumber}
              <br />
              {live.altitude.toLocaleString()} ft · {live.speed} kts
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
