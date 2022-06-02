import { observer } from "mobx-react-lite";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
import RequireAuth from "../components/RequireAith";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import { styled } from '@mui/material/styles';
import NavBar from "../components/NavBar";
import React, { useContext } from "react";
import { Context } from "..";
import Sidebar from "../components/SideBar";
import AddUser from "../pages/AddUser";
import { APPBAR_DESKTOP, DRAWER_WIDTH } from "../const";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import AddCourse from "../pages/AddCourse";
import ModuleDetail from "../pages/ModuleDetail";


export default observer(function RouteComponent(props) {
  const {user} = useContext(Context)

  const RootStyle = styled('div')({
    display: 'flex',
    flexDirection: 'column'
  });
  
  const ArtcicleStyle = styled('div')({
    flexShrink: 0,
    width: user.getAuth ? `calc(100% - ${DRAWER_WIDTH + 1}px)` : '100%',
    marginLeft: 'auto',
    marginTop: `${APPBAR_DESKTOP + 40}px`,
    paddingBottom: 20
  });

  const viewLogin = () => {
    if (user.getAuth) {
      return <Navigate replace to="/dashboard"/>
    }
    return <Login/>
  }

  return(
    <RootStyle>
      <Router>
        {user.getAuth &&
          <React.Fragment>
            <NavBar/>
            <Sidebar/>
          </React.Fragment>
        }
        <ArtcicleStyle>
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path='/dashboard' element={
              <RequireAuth>
                <Dashboard/>
              </RequireAuth>
            }/>
            <Route path='/add-user' element={
              <RequireAuth>
                <AddUser/>
              </RequireAuth>
            }/>
            <Route path='/courses' element={
              <RequireAuth>
                <Courses/>
              </RequireAuth>
            }/>
            <Route path='/add-course' element={
              <RequireAuth>
                <AddCourse/>
              </RequireAuth>
            }/>
            <Route path="/course/:id" element={
              <RequireAuth>
                <CourseDetail/>
              </RequireAuth>
            } />
            <Route path="/course/:id/module-detail" element={
              <RequireAuth>
                <ModuleDetail/>
              </RequireAuth>
            } />
            <Route path="/login" element={viewLogin()} />
          </Routes>
        </ArtcicleStyle>
      </Router>
    </RootStyle>
  )
})