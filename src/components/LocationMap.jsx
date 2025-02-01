import { useState, useMemo } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} onLocationSelect={onLocationSelect} />
      </div>

    <div style={{height: "500px", width: "100%"}}>
    <APIProvider apiKey={"AIzaSyCqK3dniQj_pFBtgl5GjCUmwp7F_6f4cc4"}>
      <div style={{ height: "100%", width: "100%" }}>
        <Map zoom={18} center={selected} mapId={"cc38c4c76d152f62"}>
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
