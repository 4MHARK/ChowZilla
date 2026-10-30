import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './Layouts/CustomerLayout'
import HomePage from './Pages/Customer/Homepage'
import AuthPage from './Pages/Customer/AuthPage'
import PartnerLandingPage from './Pages/Customer/PartnerLandingPage'
import NotFoundPage from './Pages/NotFoundPage'
import ScrollToTop from './Components/ScrollToTop'

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/vendors" element={<PartnerLandingPage type="vendor" />} />
        <Route path="/riders" element={<PartnerLandingPage type="rider" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
