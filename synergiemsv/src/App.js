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


const appRouter = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />}/>
    <Route path="/login" element={<Login />} />
    <Route path="/superadmin/:id" element={<SuperAdmin />} />
    <Route path="/admin/:id" element={<Admin />}>
      <Route index element={<AdminHome />} />
      <Route path="overview" element={<Overview />} />
      <Route path="roadmap" element={<Roadmap />} />
      <Route path="roadmap/:leaderid" element={<Roadmap />} />
      <Route path="details" element={<Details />} />
      <Route path="details/:clientid" element={<Details />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="/leader/:id" element={<Leader />} >
      <Route index element={<LeaderHome />} />
      <Route path="details" element={<LeaderInfo />} />
      <Route path="settings" element={<SettingLeader />} />

    </Route>
    <Route path="/user/:id" element={<User />} >
      <Route index element={<UserHome />} />
      <Route path="details" element={<UserInfo />} />
      <Route path="settings" element={<SettingUser />} />
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
