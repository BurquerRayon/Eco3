import React from 'react';
import Footer from '../components/Footer';
import '../styles/About.css';

const HomeGuest = () => {
  return (
    <div className="home-guest-container">
      <section className="hero">
        <h1>Bienvenido a EcoMaravillas</h1>
          <p>Explora, reserva y descubre la naturaleza.</p>
      </section>

      <section className="about">
        <h2>¿Qué es EcoMaravillas?</h2>
        <p>Una plataforma que conecta a los amantes de la naturaleza con experiencias inolvidables.</p>
      </section>

      <section className="about">
        <h2>Mision</h2>
        <p>Preservar y exhibir el patrimonio cultural y natural de la región, ofreciendo a los visitantes una experiencia educativa y enriquecedora que destaque la riqueza histórica y geológica de la Cueva de las Maravillas. </p>
      </section>

      <section className="about">
        <h2>Visision</h2>
        <p> Ser reconocidos como un destino turístico líder en la República Dominicana, comprometidos con la conservación del medio ambiente y la promoción del conocimiento sobre las civilizaciones precolombinas, especialmente los taínos. </p>
      </section>

      <section className="about">
        <h2>Valores</h2>
        
        <h1>Compromiso con la educación</h1>
        <p>Promovemos el conocimiento y la comprensión de la historia, la geología y la cultura taína de la región, brindando una experiencia educativa única a nuestros visitantes.

        <h1>Preservación del patrimonio</h1>
        Nuestra misión es proteger y conservar las formaciones geológicas y el arte rupestre, asegurando que las futuras generaciones puedan disfrutar de este invaluable tesoro cultural.

        <h1>Accesibilidad e inclusión</h1>
        Nos esforzamos por garantizar que todas las personas, sin importar sus capacidades, puedan acceder y disfrutar plenamente de la experiencia de la Cueva de las Maravillas.
        
        <h1> Sostenibilidad ambiental</h1>
        Adoptamos prácticas responsables y respetuosas con el medio ambiente, contribuyendo a la conservación del entorno natural para el beneficio de la comunidad y de las generaciones venideras. </p>
      
      </section>

      <Footer />
    </div>
  );
};

export default HomeGuest;
