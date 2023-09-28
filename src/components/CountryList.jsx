//import PropTypes from "prop-types";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

const BASE_URL = "http://localhost:3001";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (!cities && !isLoading) return <></>;
  if (cities.length === 0 && !isLoading) {
    return <Message message="No countries found, click on Map to add city" />;
  }

  const countries = cities
    .filter(
      (city, index, self) =>
        index === self.findIndex((t) => t.country === city.country)
    )
    .map((city) => ({
      id: city.id,
      country: city.country,
      emoji: city.emoji,
    }));

  console.log(countries);
  return (
    <ul className={styles.countryList}>
      {isLoading && <Spinner />}
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
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

export default CountryList;
