import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import logo from '../assets/Logo.png';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/get-categories/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Categories received:', data);
        setCategories(data);
      } /*catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
        // Fallback to mock data in case of error
        setCategories([
          {
            id: 1,
            name: "SUV",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&h=600",
            price: 150.00
          },
          {
            id: 2,
            name: "Sedan",
            image: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=800&h=600",
            price: 100.00
          },
          {
            id: 3,
            name: "Sports Car",
            image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&h=600",
            price: 250.00
          },
          {
            id: 4,
            name: "Van",
            image: "https://images.unsplash.com/photo-1558383331-f520f2888351?auto=format&fit=crop&w=800&h=600",
            price: 180.00
          },
          {
            id: 5,
            name: "Luxury",
            image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&h=600",
            price: 300.00
          }
        ]);
      } */finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-logo">
          <img src={logo} alt="AlquilappCar Logo" className="logo" />
        </div>
        <div className="nav-links">
          <a href="#home">Inicio</a>
          <a href="#cars">Vehículos</a>
          <a href="#about">Nosotros</a>
          <a href="#contact">Contacto</a>
          <button className="login-btn">Iniciar Sesión</button>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Manejá tu camino</h1>
          <p>Desde 2005 ofreciendo el mejor servicio de alquiler de vehículos</p>
          <div className="cta-buttons">
            <button className="primary-btn">Reservar Ahora</button>
            <button className="secondary-btn">Ver Vehículos</button>
          </div>
          
          {/* Categories Section */}
          <div className="category-section">
            {isLoading ? (
              <div className="loading-text">Cargando categorías...</div>
            ) : (
              <div className="category-list">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="category-card"
                    onClick={() => console.log(`Selected category: ${category.name}`)}
                  >
                    <div className="category-image-container">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="category-image"
                      />
                    </div>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      <span className="category-price">${category.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 