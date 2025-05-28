import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Pin,
  Map,
} from "@vis.gl/react-google-maps";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Button from "@mui/material/Button";

export default function MapSelector({ onLocationSelect, initialLocation }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqK3dniQj_pFBtgl5GjCUmwp7F_6f4cc4",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap1
      onLocationSelect={onLocationSelect}
      initialLocation={initialLocation}
    />
  );
}

function GoogleMap1({ onLocationSelect, initialLocation }) {
  const [selected, setSelected] = useState(null); // confirmed
  const [pendingLocation, setPendingLocation] = useState(null); // pending (click/search)
  const [mapRef, setMapRef] = useState(null); // pan camera
  const [center, setCenter] = useState(null); // for controlled center

  useEffect(() => {
    if (initialLocation) {
      setSelected(initialLocation);
      setPendingLocation(initialLocation);
      setCenter(initialLocation);
    } else {
      getUserLocation();
    }
  }, [initialLocation]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if(!initialLocation){
            setSelected(location);
            setPendingLocation(location);
            setCenter(location);
          }
         
        },
        () => {
          const fallback = { lat: 43.45, lng: -80.49 };
          setSelected(fallback);
          setPendingLocation(fallback);
          setCenter(fallback);
        }
      );
    }
  };

  const handleMapClick = (e) => {
    const coords = e.detail.latLng;
    setPendingLocation(coords);
    setCenter(coords); // pan the map
  };

  const confirmLocation = () => {
    if (pendingLocation) {
      setSelected(pendingLocation);
      onLocationSelect(pendingLocation);
    }
  };

  return (
    <>
      {pendingLocation && (
        <>
          <div className="places-container" style={{ marginBottom: 10 }}>
            <PlacesAutocomplete
              onPlaceSelect={(loc) => {
                setPendingLocation(loc);
                setCenter(loc);
              }}
              selected={pendingLocation}
              setSelected={setPendingLocation}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={confirmLocation}
              disabled={!pendingLocation}
              style={{ marginLeft: 10, marginTop: 5 }}>
              Update Location
            </Button>
          </div>

          <div style={{ height: "500px", width: "100%" }}>
            <APIProvider apiKey="AIzaSyCqK3dniQj_pFBtgl5GjCUmwp7F_6f4cc4">
              <Map
                mapId="cc38c4c76d152f62"
                zoom={16}
                center={center}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onClick={handleMapClick}
                onLoad={(map) => setMapRef(map)}
                style={{ height: "100%", width: "100%" }}>
                {selected && (
                  <AdvancedMarker position={selected}>
                    <Pin background="green" glyphColor="white" />
                  </AdvancedMarker>
                )}

                {pendingLocation && (
                  <AdvancedMarker position={pendingLocation}>
                    <Pin background="orange" glyphColor="white" />
                  </AdvancedMarker>
                )}
              </Map>
            </APIProvider>
          </div>
        </>
      )}
    </>
  );
}

const PlacesAutocomplete = ({ onPlaceSelect, selected, setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInputChange = (event, newValue) => {
    setValue(newValue || "");
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    if (!address) return;

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onPlaceSelect({ lat, lng });
  };

  return (
    <>
      <Autocomplete
        freeSolo
        options={
          status === "OK" ? data.map(({ description }) => description) : []
        }
        onInputChange={handleInputChange}
        onChange={(event, value) => handleSelect(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search an address"
            variant="outlined"
            fullWidth
            disabled={!ready}
          />
        )}
      />

      <div className="mt-2 flex gap-2">
      <TextField
        value={selected.lat ? selected.lat : ""}
        onChange={(e) => {
          console.log(e.target.value)
          setSelected({ ...selected, lat: parseFloat(e.target.value) })
        }
        }
        label={"Latitude"}
        size="small"
        className="mt-2"
      />
      <TextField
        value={selected.lng ? selected.lng : ""}
        onChange={(e) => setSelected({ ...selected, lng: parseFloat(e.target.value) })}
        label={"Longitude"}
        size="small"
        className="ml-2"
      />
      </div>
    </>
  );
};
