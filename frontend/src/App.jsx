import { Routes, Route} from 'react-router';
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import BiddingPage from "./pages/BiddingPage";
import GamingLaptopsPage from "./pages/GamingLaptopsPage";

import toast from "react-hot-toast";
import RentalPage from "./pages/Rentalpage";
import RentalForm from "./pages/RentalForm";


const App = () => {
  return (
    <div className="relative h-full w-ful font-titillium">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/note/:id" element={<NoteDetailPage/>}/>
        <Route path="/bidding" element={<BiddingPage />} />
        <Route path="/rental" element={<RentalPage />} />
        <Route path="/rentalform" element={<RentalForm />} />
        <Route path="/laptops" element={<GamingLaptopsPage />} />
      </Routes>
    </div>
  );
};

export default App;
