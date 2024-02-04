import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Homes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {Toaster} from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import Loader from "./components/Loader";

function App() {

  const {loader}=useSelector(state=>state.loaderReducer)
  return (
   <div>
    <Toaster position="top-center" reverseOrder={false}/>
    {loader && <Loader/>}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
