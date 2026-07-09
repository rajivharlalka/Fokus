import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Flight } from '@/lib/types';
import { getFlightProgress, getStatusColor, getStatusText } from '@/lib/utils';

const planeIcon = L.divIcon({
  className: '',
  html: `<div style="font-size:22px;transform:rotate(45deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))">✈️</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const airportIcon = L.divIcon({
  className: '',
  html: `<div style="width:11px;height:11px;border-radius:50%;background:#315EFB;border:2px solid white;box-shadow:0 2px 8px rgba(16,24,40,.35)"></div>`,
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
  const progress = getFlightProgress(flight);
  const statusColor = getStatusColor(flight.status);
  const statusText = getStatusText(flight.status);
  const centerLat = live?.latitude ?? (depLat + arrLat) / 2;
  const centerLon = live?.longitude ?? (depLon + arrLon) / 2;
  const path: [number, number][] = [
    [depLat, depLon],
    ...(live ? [[live.latitude, live.longitude] as [number, number]] : []),
    [arrLat, arrLon],
  ];

  return (
    <div className="h-72 sm:h-80 rounded-[1.35rem] overflow-hidden surface relative">
      <div
        className="absolute top-3 left-3 right-3 sm:right-auto z-[500] rounded-xl px-3.5 py-3 text-white shadow-xl backdrop-blur-md"
        style={{ background: 'rgba(16, 24, 40, 0.88)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              flight.status === 'active' ? 'status-live' : ''
            }`}
            style={{ background: statusColor }}
          />
          <span className="text-xs font-bold">{statusText}</span>
          <span className="text-[10px] text-white/45">•</span>
          <span className="text-[10px] text-white/65">{progress}% complete</span>
        </div>
        <div className="text-[10px] text-white/55 mt-1.5">
          {live
            ? `${live.altitude.toLocaleString()} ft · ${live.speed} kts · heading ${live.direction}°`
            : flight.status === 'active'
            ? 'Live position is not currently reported'
            : `${flight.departure.iata} → ${flight.arrival.iata}`}
        </div>
      </div>
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
        <Polyline positions={path} pathOptions={{ color: '#315EFB', weight: 4, opacity: 0.9 }} />
        <Marker position={[depLat, depLon]} icon={airportIcon}>
          <Popup>{flight.departure.iata}</Popup>
        </Marker>
        <Marker position={[arrLat, arrLon]} icon={airportIcon}>
          <Popup>{flight.arrival.iata}</Popup>
        </Marker>
        {live && (
          <Marker position={[live.latitude, live.longitude]} icon={planeIcon}>
            <Tooltip permanent direction="right" offset={[12, 0]} opacity={0.95}>
              <strong>{flight.flightNumber}</strong> · {statusText}
            </Tooltip>
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
