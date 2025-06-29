import React, { useEffect, useState } from "react";
import "../styles/Carrusel.css";

const images = [
  "/assets/img/Flora/e1.jpeg",
  "/assets/img/Flora/e2.jpeg",
  "/assets/img/Flora/e3.jpeg",
  "/assets/img/Flora/e4.jpeg",
  "/assets/img/Flora/e5.jpeg",
];

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = images[currentIndex];

  return (
    <div
      className="carousel-container background-carousel"
      style={{
        backgroundImage: `url(${currentImage})`,
      }}
    ></div>
  );
};

export default Carrusel;
