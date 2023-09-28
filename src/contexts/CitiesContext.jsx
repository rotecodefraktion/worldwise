import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:3001";

const CitesContext = createContext();

function initialState() {
  const cities = [];
  const isLoading = false;
  const currentCity = {};
}

function reducer(state, action) {
  switch (action.type) {
    case "GET_CITIES":
      return {
        ...state,
        cities: action.payload,
      };
    case "GET_CITY":
      return {
        ...state,
        currentCity: action.payload,
      };
    case "DELETE_CITY":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "CREATE_CITY":
      return {
        ...state,
        cities: [...state.cities, action.payload],
      };
    case "SET_ISLOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /*   const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({}); */

  useEffect(() => {
    async function fetchData() {
      try {
        //setIsLoading(true);
        dispatch({ type: "SET_ISLOADING", payload: true });
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        //setCities(data);
        dispatch({ type: "GET_CITIES", payload: data });
      } catch (error) {
        alert("Error fetching cities");
      } finally {
        dispatch({ type: "SET_ISLOADING", payload: false });
      }
    }
    fetchData();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "SET_ISLOADING", payload: true });
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      dispatch({ type: "Set_CURRENT_CITY", payload: data });
    } catch (error) {
      alert("Error fetching cities");
    } finally {
      dispatch({ type: "SET_ISLOADING", payload: false });
    }
  }

  async function deleteCity(id) {
    console.log("handleDeleteClick: ", id);
    console.log("cities: ", cities);
    try {
      dispatch({ type: "SET_ISLOADING", payload: true });
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        /* setCities((prevCities) => {
          return prevCities.filter((city) => city.id !== id);
        }); */
        dispatch({ type: "DELETE_CITY", payload: id });
      }
    } catch (error) {
      alert("Error deleting city");
      console.log(error.message);
    } finally {
      dispatch({ type: "SET_ISLOADING", payload: false });
    }
  }

  async function createCity(newCity) {
    if (!newCity.cityName) return alert("Please enter a city name");
    if (state.cities.find((city) => city.cityName === newCity.cityName))
      return alert("City already exists");

    try {
      dispatch({ type: "SET_ISLOADING", payload: true });
      const response = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity),
      });
      if (response.ok) {
        const data = await response.json();
        //setCities((cities) => [...cities, data]);
        dispatch({ type: "CREATE_CITY", payload: data });
      }
    } catch (error) {
      alert("Error creating city");
      console.log(error.message);
    } finally {
      dispatch({ type: "SET_ISLOADING", payload: false });
    }
    return null;
  }

  return (
    <CitesContext.Provider
      value={{
        cities,
        setCities,
        isLoading,
        currentCity,
        getCity,
        deleteCity,
        createCity,
      }}
    >
      {children}
    </CitesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitesContext);
  if (context === undefined) {
    throw new Error("useCitiesContext must be used within a PostProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
