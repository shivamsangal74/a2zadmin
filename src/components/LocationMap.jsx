import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdvancedMarker, APIProvider, InfoWindow, Pin ,Map} from "@vis.gl/react-google-maps";

export default function MapSelector({onLocationSelect}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqK3dniQj_pFBtgl5GjCUmwp7F_6f4cc4",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <GoogleMap1 onLocationSelect={onLocationSelect}/>;
}

function GoogleMap1({onLocationSelect}) {
  
  const [selected, setSelected] = useState({ lat: 43.45, lng: -80.49 });
  const [defaultCenter, setDefaultCenter] = useState(null);

  const [open, setOpen] = useState(false);
  // Function to get user's current location
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelected({ lat: latitude, lng: longitude });
          setDefaultCenter({ lat: latitude, lng: longitude })
          onLocationSelect({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setSelected({ lat: 43.45, lng: -80.49 }); // Default location (fallback)
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setSelected({ lat: 43.45, lng: -80.49 }); // Default location (fallback)
    }
  };

  // Fetch location on mount
  useEffect(() => {
    getUserLocation();
  }, []);
  return (
    <>
     {defaultCenter && <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} onLocationSelect={onLocationSelect} />
      </div>

    <div style={{height: "500px", width: "100%"}}>
    <APIProvider apiKey={"AIzaSyCqK3dniQj_pFBtgl5GjCUmwp7F_6f4cc4"}>
      <div style={{ height: "100%", width: "100%" }}>
        <Map defaultZoom={16} defaultCenter={defaultCenter}  gestureHandling={"greedy"} mapId={"cc38c4c76d152f62"} onClick={(e)=> {
          setSelected(e.detail.latLng)
          onLocationSelect(e.detail.latLng)
          }}>
          <AdvancedMarker position={selected} onClick={() => setOpen(true)}>
            <Pin
              background={"grey"}
              borderColor={"green"}
              glyphColor={"purple"}
            />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={selected} onCloseClick={() => setOpen(false)}>
              <p>I'm in Hamburg</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
    </div>
     </>}
    </>
  );
}

const PlacesAutocomplete = ({ setSelected,onLocationSelect }) => {
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
debugger
    if (!address) return;

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
    onLocationSelect({ lat, lng });
  };

  return (
    <Autocomplete
      freeSolo
      options={status === "OK" ? data.map(({ description }) => description) : []}
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
  );
};
