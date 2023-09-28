// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";
import { useUrlPosition, getCenterPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { cities, createCity, isLoading } = useCities();
  const [lat, lng] = useUrlPosition();
  const [isloadingGeoData, setIsLoadingGeoData] = useState(false);
  const [errorGeoData, setErrorGeoData] = useState("");

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const position = { lat: lat, lng: lng };

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchData() {
      try {
        setIsLoadingGeoData(true);
        setErrorGeoData("");
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        console.log(data);
        if (data.countryCode === "") {
          throw new Error("No city found, please click somewhere else");
        }
        setCityName(data.city);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setErrorGeoData(error.message);
      } finally {
        setIsLoadingGeoData(false);
      }
    }
    fetchData();
  }, [lat, lng]);

  const navigate = useNavigate();

  async function handleAddCity(e) {
    e.preventDefault();

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position,
    };
    console.log(newCity);
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isloadingGeoData) return <Spinner />;

  if (errorGeoData) return <Message message={errorGeoData} />;

  if (!lat || !lng) return <Message message="Please click on the map" />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={(e) => handleAddCity(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          defaultValue={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/*  <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          defaultValue={
            date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
          }
        /> */}

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="P"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          defaultValue={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
