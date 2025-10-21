import './App.css'

import Navbar from './components/Navbar';
import {Routes, Route, BrowserRouter} from 'react-router'
import PrivateRoutes from './utils/PrivateRoutes'
import ProductPage from './pages/ProductPage'
import TransactionPage from './pages/TransactionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import Dashboard from './components/Dashboard'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage';
function App() {
  

  return (
    <div className="min-h-full">
    <BrowserRouter>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 font-inter">
        <Routes>

          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route element={<PrivateRoutes/>}>
            <Route path='/main' element={<Dashboard/>}/>
            <Route path='/products' element={<ProductPage/>}/>
            <Route path='/products/:id' element={<ProductDetailPage/>}/>
            <Route path='/transaction' element={<TransactionPage/>}/>
          </Route>
        </Routes>
     </div>
    </BrowserRouter> 
    </div>
  )
}

export default App
