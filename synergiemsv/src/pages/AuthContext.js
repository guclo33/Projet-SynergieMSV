import React, { createContext, useState, useEffect } from 'react';
import Cookies from "js-cookie"

export const AuthContext = createContext();

export const  AuthProvider = ({children}) => {
  ;  
  const [user, setUser] = useState(null);

    useEffect(() => {
      const checkSession = async () => {
        
        try {
              // Vérifie la session côté serveur
              const response = await fetch('http://localhost:3000/api/auth/check', {
                  method: 'GET',
                  credentials: 'include', // Assure que les cookies de session sont envoyés
              });

              if (response.ok) {
                  const userData = await response.json();
                  setUser(userData); // Met à jour l'état utilisateur avec les données serveur
                  console.log('User authenticated via server:', userData);
              } else {
                  setUser(null);
                  Cookies.remove('user'); // Supprime le cookie utilisateur si la session n'est pas valide
                  console.warn('Session not valid. User logged out.');
              }
          } catch (error) {
              console.error('Error checking session:');
              setUser(null);
              Cookies.remove('user');
          }
      };

      checkSession(); // Appelle la vérification de session lors du chargement initial
  }, []);

  // Fonction de login
  const login = (userData) => {
      setUser(userData);
      Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Stocke dans un cookie pour des raisons supplémentaires (optionnel)
  };

  // Fonction de logout
  const logout = async () => {
      try {
          await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include', // Assure que la requête inclut le cookie de session
          });
          setUser(null);
          Cookies.remove('user'); // Supprime le cookie utilisateur
          console.log('User logged out successfully.');
      } catch (error) {
          console.error('Error during logout:', error);
      }
  };

      return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
}