import Footer from "../../components/landing_page/footer";
import Navbar from "../../components/landing_page/navbar";
import './landing_page_style.css';

export default function LandingPage() {
  return (
    <div style={
      {
        width: "100%"
      }
    }>
      <Navbar />
      <div>
        <section id="home">
            <div>
                <h1>Manage FYPs with <u>ease</u> like never before</h1>
                <p>Control, Monitor, and Guide your students using SPARES to achieve the optimal output.</p>
            </div>
            <div>
                <p>AsestImage</p>
            </div>
        </section>
        <section id="about" className="secondSect">
            <h2>Guide your students to the new era of project management and produce more quality outputs</h2>
            <span>MainAssetImageHere</span>
        </section>
        <section id="hall-of-shame">
            <h2>Hall of Shame</h2>
            <span>TableHere</span>
            <p>RandomTipMessageHere</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}