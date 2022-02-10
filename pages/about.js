/**
 * About page for information about Upper Room Media
 */
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <h1>About</h1>
      <Footer />
    </div>
  );
}

export default About;
