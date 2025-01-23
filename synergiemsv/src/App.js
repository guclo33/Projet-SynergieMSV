import React from 'react';
import './App.css';
import "./variables.css";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import {Home} from "./pages/home/Home"
import {Register} from "./pages/register/Register"
import {Login} from "./pages/login/Login"
import {Admin} from "./pages/admin/Admin"
import {Leader} from "./pages/leader/Leader"
import {User} from "./pages/user/User"
import { AdminHome } from "./pages/admin/components/AdminHome"
import { Overview} from "./pages/admin/components/Overview"
import { Roadmap } from "./pages/admin/components/Roadmap"
import { Details } from "./pages/admin/components/Details"
import { Settings } from  "./pages/admin/components/Settings"
import { AuthProvider } from './pages/AuthContext'
import { Unauthorized } from './pages/unauthorized/Unauthorized';
import { SuperAdmin } from './pages/superAdmin/SuperAdmin'; 
import { LeaderHome } from './pages/leader/components/LeaderHome';
import { UserHome } from './pages/user/components/UserHome';
import { LeaderInfo } from './pages/leader/components/LeaderInfo';
import { SettingLeader } from './pages/leader/components/SettingLeader';
import { UserInfo } from './pages/user/components/UserInfo';
import { SettingUser } from './pages/user/components/SettingUser';
import { Objectifs } from './pages/admin/components/Objectifs';
import { LeaderObjectifs } from './pages/leader/components/LeaderObjectifs';
import { UserObjectifs } from './pages/user/components/UserObjectifs';
import { AdminProvider } from './pages/admin/AdminContext';
import { LeaderProvider } from './pages/leader/LeaderContext';
import { UserProvider } from './pages/user/UserContext';
import { Form } from './pages/form/Form';
import { FormHome } from './pages/form/FormHome';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './pages/form/Redux/store'
import { GestionGroupe } from './pages/admin/components/GestionGroupe';
import { adminStore, adminPersistor } from './pages/admin/Redux/adminStore';


const appRouter = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />}/>
    <Route path="/login" element={<Login />} />
    <Route path="/superadmin/:id" element={<SuperAdmin />} />

    <Route path="/admin/:id" element={
      <AdminProvider store={adminStore} persistor={adminPersistor}>
        
            <Admin />
          
      </AdminProvider>
    }>
      <Route index element={<AdminHome />} />
      <Route path="objectifs" element={<Objectifs />} />
      <Route path="objectifs/:clientid" element={<Objectifs />} />

      <Route path="roadmap" element={<Roadmap />} />
      <Route path="roadmap/:clientid" element={<Roadmap />} />
      <Route path="gestion" element={<GestionGroupe />} />
      <Route path="details" element={<Details />} />
      <Route path="details/:clientid" element={<Details />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    <Route path="/leader/:id" element={
      <LeaderProvider>
        <Leader />
      </LeaderProvider>
    }>
      <Route index element={<LeaderHome />} />
      <Route path="objectifs" element={<LeaderObjectifs />} />
      <Route path="details" element={<LeaderInfo />} />
      <Route path="details/:clientid" element={<LeaderInfo />} />
      <Route path="settings" element={<SettingLeader />} />

    </Route>
    <Route path="/user/:id" element={
      <UserProvider>
        <User />
        </UserProvider>
    }>
      <Route index element={<UserHome />} />
      <Route path="objectifs" element={<UserObjectifs />} />
      <Route path="details" element={<UserInfo />} />
      <Route path="settings" element={<SettingUser />} />
    </Route> 

    <Route path="/form" element={
      <Provider store={store}> 
        <PersistGate loading={null} persistor={persistor}>
            <FormHome />
        </PersistGate>
      </Provider>
    }>
      <Route index element={<Form />} />
    </Route>

    <Route path="/unauthorized" element={<Unauthorized />} />
  </>

))
;


function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;
