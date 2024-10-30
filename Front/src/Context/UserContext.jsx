import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    idUsuario: null,
    idRol: null,
    nombre: null,
    email: null , 
    apellido: null,
    idVendedor: null
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  
  const setIdUsuarioYRol = (idUsuario, idRol, nombre, email, apellido, idVendedor) => {
    const newUser = { idUsuario, idRol, nombre, email, apellido, idVendedor };
    setUserData(newUser);
    localStorage.setItem('userData', JSON.stringify(newUser));
  };

  const logout = () => {
   
    setUserData({
      idUsuario: null,
      idRol: null, 
      nombre: null,
      email: null  ,
      apellido:null, 
      idVendedor :null
    });
    localStorage.removeItem('userData');
     localStorage.clear();
  };
  return (
    <UserContext.Provider value={{ userData, setIdUsuarioYRol, logout }}>
      {children}
    </UserContext.Provider>
  );
};
