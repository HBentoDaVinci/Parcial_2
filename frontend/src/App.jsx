// Rutas
import { Routes, Route } from 'react-router-dom';
import {AuthProvider, AuthContext} from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import Header from './layouts/Header'

// Vistas
import Home from './views/Home'
import Cotizador from './views/Cotizador';
import PlanesList from './views/PlanesList';

import PlanesAdmin from './admin/planes/Planes';
import EditarPlan from './admin/planes/EditarPlan';
import VerPlan from './admin/planes/Plan';
import Prepagas from './admin/prepagas/Prepagas';
import EditarPrepaga from './admin/prepagas/EditarPrepaga';
import Usuarios from './admin/usuarios/Usuarios';
import EditarUsuario from './admin/usuarios/EditUsuario';

import Login from './admin/login/Login';

function App() {

  return (
    <>
      <AuthProvider>
        <Header/>

        <main>
          <Routes>
            <Route path='/' element={ <Home/> }/>
            <Route path='/cotizador' element={ <Cotizador/> }/>
            <Route path='/planes' element={ <PlanesList/> }/>
            <Route path='/admin/planes' element={ <PrivateRoute><PlanesAdmin/></PrivateRoute> }/>
            <Route path='/admin/editarPlan/:id' element={ <PrivateRoute><EditarPlan/></PrivateRoute> }/>
            <Route path='/admin/verPlan/:id' element={ <PrivateRoute><VerPlan/></PrivateRoute> }/>
            <Route path='/admin/usuarios' element={ <PrivateRoute><Usuarios/></PrivateRoute> }/>
            <Route path='/admin/editarUsuario/:id' element={ <PrivateRoute><EditarUsuario/></PrivateRoute> }/>
            <Route path='/admin/prepagas' element={ <PrivateRoute><Prepagas/></PrivateRoute> }/>
            <Route path='/admin/editarPrepaga/:id' element={ <PrivateRoute><EditarPrepaga/></PrivateRoute> }/>
            <Route path='/admin/login' element={ <Login/> }/>
          </Routes>
        </main>
      </AuthProvider>
    </>
  )
}

export default App
