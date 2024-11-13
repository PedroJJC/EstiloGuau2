import React,  {createContext, useEffect, useState } from "react";

const LocationContext = createContext();

 const LocationProvider = ({ children }) => {
    const APIkey = "181f484324cb4ad3971c7e1fde1d920e";
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
  
    // Función para obtener información de ubicación basada en latitud y longitud
    function getLocationInfo(latitude, longitude) {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.status.code === 200) {
            const result = data.results[0];
            setLocation(result.formatted);
            setCity(result.components.city || "Unknown city");
            setCountry(result.components.country || "Unknown country");
          } else {
            console.log("Reverse geolocation request failed.");
          }
        })
        .catch((error) => console.error("Error fetching location:", error));
    }
  
    // Función para manejar éxito en obtener coordenadas
    function success(pos) {
      var crd = pos.coords;
      getLocationInfo(crd.latitude, crd.longitude);
      console.log("Tu posición actual es:");
      console.log(`Tu latitud : ${crd.latitude}`);
      console.log(`Tu longitud: ${crd.longitude}`);
      console.log(`Más o menos ${crd.accuracy} metros.`);
    }
  
    // Función para manejar errores de geolocalización
    function errors(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  
    // Opciones de geolocalización
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
  
    // useEffect para pedir permisos de geolocalización y obtener la ubicación
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((result) => {
            console.log(result);
  
            if (result.state === "granted") {
              navigator.geolocation.getCurrentPosition(success, errors, options);
              console.log("Permiso de geolocalización concedido.");
            } else if (result.state === "prompt") {
              navigator.geolocation.getCurrentPosition(success, errors, options);
              console.log("Permiso de geolocalización requiere autorización.");
            } else if (result.state === "denied") {
              console.log("Permiso de geolocalización denegado.");
            }
          })
          .catch((error) => {
            console.error("Error al consultar permisos de geolocalización:", error);
          });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }, []);
  
    return (
      <LocationContext.Provider value={{ location, city, country }}>
        {children}
      </LocationContext.Provider>
    );
  };

  export { LocationContext, LocationProvider };