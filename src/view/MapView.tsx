// view/MapView.tsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export type MarkerData = {
  id: string;
  position: LatLngExpression;
  popup?: string;
};

type Props = {
  center: LatLngExpression;
  zoom?: number;
  markers?: MarkerData[];
  className?: string;
};

function RecenterOnChange({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
    // 다음 페인트 이후 컨테이너 사이즈 재계산
    setTimeout(() => map.invalidateSize(), 0);
  }, [map, center]);
  return null;
}

export default function MapView({
  center,
  zoom = 12,
  markers = [],
  className = "",
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []); // StrictMode 이중 마운트 대비
  if (!mounted) return null;

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow ${className}`}
      style={{ height: "70vh", width: "100%" }} // ← 임시 인라인 높이
    >
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <RecenterOnChange center={center} />
        <TileLayer
          url={
            import.meta.env.VITE_TILE_URL ||
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution="&copy; OpenStreetMap contributors"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={m.position}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
