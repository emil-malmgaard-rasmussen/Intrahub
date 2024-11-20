import Guide from './components/Guide'
import MoreDetail from "./components/MoreDetail";
import Featured from "./components/Featured";
import Footer from "./components/Footer";
import Navbar from './components/Navbar';

const PrivacyPage = () => {
    return (
        <div className="App">
            <Navbar/>
            <Guide />
            {/*<Properties />*/}
            <MoreDetail />
            <Featured />
            <Footer />
        </div>
    );
}

export default PrivacyPage;
