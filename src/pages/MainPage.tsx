// pages/MainPage.tsx
import { useState } from "react";
import type { LatLngExpression } from "leaflet";
import MapView from "~/view/MapView";
import type { MarkerData } from "~/view/MapView";

type PlaceResult = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
};

const SEOUL: LatLngExpression = [37.5665, 126.978];

export default function MainPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [center, setCenter] = useState<LatLngExpression>(SEOUL);

  const markers: MarkerData[] = results.map((r) => ({
    id: String(r.id),
    position: [r.lat, r.lon] as LatLngExpression,
    popup: r.name,
  }));

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;

    setLoading(true);
    try {
      const base =
        import.meta.env.VITE_NOMINATIM_URL ||
        "https://nominatim.openstreetmap.org/search";
      const url = `${base}?format=json&q=${encodeURIComponent(
        q
      )}&addressdetails=1&limit=12`;
      const res = await fetch(url, { headers: { "Accept-Language": "ko" } });
      const data: any[] = await res.json();

      const list: PlaceResult[] = data.map((d) => ({
        id: d.place_id,
        name: d.display_name,
        lat: parseFloat(d.lat),
        lon: parseFloat(d.lon),
        address: d?.address && Object.values(d.address).join(", "),
      }));

      setResults(list);
      if (list[0]) setCenter([list[0].lat, list[0].lon]);
    } catch (err) {
      console.error(err);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onPick = (p: PlaceResult) => {
    setCenter([p.lat, p.lon]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-[360px,1fr] gap-4">
          {/* Left: 검색 패널 */}
          <aside className="rounded-2xl bg-white shadow p-4 md:sticky md:top-4 h-fit">
            <h2 className="text-lg font-semibold mb-3">장소 검색</h2>
            <form onSubmit={search} className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="예: 서울시청, 강남역, 카페"
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-gray-900 text-white"
              >
                {loading ? "검색 중…" : "검색"}
              </button>
            </form>

            <div className="mt-4 border-t pt-3">
              {results.length === 0 && (
                <p className="text-sm text-gray-500">
                  검색 결과가 여기에 표시됩니다.
                </p>
              )}
              {results.length > 0 && (
                <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => onPick(r)}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 border"
                        title={r.name}
                      >
                        <div className="font-medium truncate">{r.name}</div>
                        {r.address && (
                          <div className="text-xs text-gray-500 truncate">
                            {r.address}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Right: 지도 */}
          <section className="rounded-2xl bg-white shadow p-0 h-[70vh]">
            <MapView center={center} markers={markers} />
          </section>
        </div>
      </div>
    </div>
  );
}
