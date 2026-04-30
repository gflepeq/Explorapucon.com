import Hero from "../components/Hero";
import ServiceSearch from "../components/ServiceSearch";
import BusinessLines from "../components/BusinessLines";
import Accommodation from "../components/Accommodation";
import Gastronomy from "../components/Gastronomy";
import Tours from "../components/Tours";
import Transfer from "../components/Transfer";
import RentACar from "../components/RentACar";
import Winter from "../components/Winter";
import Destinations from "../components/Destinations";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceSearch />
      <BusinessLines />
      <Accommodation />
      <Gastronomy />
      <Tours />
      <Transfer />
      <RentACar />
      <Winter />
      <Destinations />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}
