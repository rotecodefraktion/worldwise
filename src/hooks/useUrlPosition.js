import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat, lng];
}

export function getCenterPosition(cities) {
  console.log(cities);
  if (cities.length > 0) {
    const positionSum = cities.reduce(
      (acc, city) => {
        let { lat, lng } = acc;
        lat += Number(city.position.lat);
        lng += Number(city.position.lng);

        acc = { lat: lat, lng: lng };
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    const centerPos = [
      positionSum.lat / cities.length,
      positionSum.lng / cities.length,
    ];
    console.log(centerPos);
    return centerPos;
  }
  return [0, 0];
}
