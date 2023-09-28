import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition, getCenterPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([0, 0]);
  const zoom = useState(6);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  function DetectOnClick() {
    const navigate = useNavigate();
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        navigate(`form?lat=${lat}&lng=${lng}`);
      },
    });
  }

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      setMapPosition(getCenterPosition(cities));
    },
    [cities]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        console.log("geolocationPosition: ", geolocationPosition);
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : `Get my Position`}
      </Button>

      <MapContainer
        center={
          mapPosition.length > 0 ? mapPosition : getCenterPosition(cities)
        }
        zoom={mapPosition.length > 0 ? 6 : cities.length > 0 ? 4 : 0}
        scrollWheelZoom={true}
        className={styles.map}
        key={mapLat}
      >
        <ChangeView
          center={mapPosition}
          zoom={mapPosition.length > 0 ? 6 : cities.length > 0 ? 4 : 0}
        />
        <DetectOnClick />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
