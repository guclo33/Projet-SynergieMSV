import React, { createContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import héro from "../Images/archetypes/Héros.webp";
import explorateur from "../Images/archetypes/Explorateur.webp";
import sage from "../Images/archetypes/Sage.webp";
import rebelle from "../Images/archetypes/Rebelle.webp";
import bouffon from "../Images/archetypes/Bouffon.webp";
import magicien from "../Images/archetypes/Magicien.webp";
import créateur from "../Images/archetypes/Créateur.webp";
import citoyen from "../Images/archetypes/Citoyen.webp";
import innocent from "../Images/archetypes/Innocent.webp";
import protecteur from "../Images/archetypes/Protecteur.webp";
import souverain from "../Images/archetypes/Souverain.webp";
import amoureuse from "../Images/archetypes/amoureuse.webp";

export const AuthContext = createContext();

export const  AuthProvider = ({children}) => {
  ;  
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';
    useEffect(() => {
      const checkSession = async () => {
        
        try {
              // Vérifie la session côté serveur
              const response = await fetch(`${apiUrl}/api/auth/check`, {
                  method: 'GET',
                  credentials: 'include', // Assure que les cookies de session sont envoyés
              });

              if (response.ok) {
                  const userData = await response.json();
                  setUser(userData); // Met à jour l'état utilisateur avec les données serveur

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
      Cookies.set('user', JSON.stringify(userData), {expires: 7, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Lax', 
      path: '/',}) 
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

      } catch (error) {
          console.error('Error during logout:', error);
      }
  };

  const archetypeImage = (arch) =>{
    
    
    switch (String(arch).toLowerCase()) {
            case "héro" :
            case "héros" :
                return héro
                
            case "explorateur":
            case "explorateurs":
            case "exploratrice":
            case "exploratrices":
                return explorateur;
                
            case "amoureux" :
            case "amoureuse" :
            case "amoureux" :
            case "amoureuses":
                return amoureuse;
                
            case "sage" :
            case "sages":
                return sage;
                
            case "rebelle" :
            case "rebelles" :
            case "rebel" :
            case "rebels":
                return rebelle;
                
            case "bouffon" :
            case "bouffons":
                return bouffon;
                
            case "magicien" :
            case "magicienne" :
            case "magiciens" :
            case "magiciennes":
                return magicien;
                
            case "créateur" :
            case "créatrice" :
            case "créateurs" :
            case "créatrices":
                return créateur;
                
            case "citoyen" :
            case "citoyenne" :
            case "citoyens" :
            case "citoyennes":
                return citoyen;
                
            case "optimiste" :
            case "optimistes" :
            case "innocent" :
            case "innocente" :
            case "innocents" :
            case "innocentes":
                return innocent;
                
            case "protecteur" :
            case "protectrice" :
            case "protecteurs" :
            case "protectrices":
                return protecteur;
                
            case "souverain" :
            case "souveraine" :
            case "souverains" :
            case "souveraines":
                return souverain;
                
            default:
                return "Missing image";
                
    
        }
  }
  

      return (
        <AuthContext.Provider value={{ user, login, logout, archetypeImage, apiUrl }}>
          {children}
        </AuthContext.Provider>
      );
}