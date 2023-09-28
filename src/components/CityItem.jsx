import styles from "./CityItem.module.css";
import dateFormat from "date-and-time";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  const isActive = currentCity?.id === id ? true : false;

  function onDeleteCity(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          isActive ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <span className={styles.date}>
          ({dateFormat.format(new Date(date), "MMMM DD, YYYY")})
        </span>
        <button className={styles.deleteBtn} onClick={(e) => onDeleteCity(e)}>
          &times;
        </button>
      </Link>
    </li>
  );
}

/* CityItem.propTypes = {
  city: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
}; */

export default CityItem;
