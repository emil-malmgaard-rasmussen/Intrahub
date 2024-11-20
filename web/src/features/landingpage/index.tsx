import Hero from "./components/Hero";
import Guide from './components/Guide'
import Properties from "./components/Properties";
import MoreDetail from "./components/MoreDetail";
import Featured from "./components/Featured";
import Footer from "./components/Footer";
import Navbar from './components/Navbar';

const LandingPage = () => {
    return (
        <div className="App">
            <Navbar/>
            <Hero />
            <Guide />
            <Properties />
            <MoreDetail />
            <Featured />
            <Footer />
        </div>
    );
}

export default LandingPage;
