import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, Category } from '../services/category.service';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-avance del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [categories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenido a 4WARD Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Tu solución para el alquiler de vehículos
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Comenzar
          </button>
        </div>
      </div>

      {/* Carrusel de Categorías */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestras Categorías</h2>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-lg shadow-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="w-full flex-shrink-0 p-8 bg-white"
                >
                  <div className="text-center">
                    {category.imagen && (
                      <img
                        src={category.imagen}
                        alt={category.nombre}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-2xl font-semibold mb-2">{category.nombre}</h3>
                    <p className="text-gray-600">{category.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles del carrusel */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
          >
            →
          </button>

          {/* Indicadores */}
          <div className="flex justify-center mt-4 space-x-2">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 4WARD Solutions. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 