import styles from "./CityList.module.css";
import PropTypes from "prop-types";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

const BASE_URL = "http://localhost:3001";

function CityList() {
  const { cities, isLoading, setCities } = useCities();

  if (!cities.length) {
    return <Message message="No cities found, click on Map to add one" />;
  }

  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city, index) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  );
}

/* CityList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  setCities: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func,
}; */

export default CityList;
