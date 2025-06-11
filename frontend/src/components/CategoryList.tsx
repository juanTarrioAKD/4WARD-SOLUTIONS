'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCategories, type Category } from '@/services/categories';
import { getAuthToken } from '@/services/auth';

interface CategoryListProps {
  setShowLoginForm: (show: boolean) => void;
}

export default function CategoryList({ setShowLoginForm }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar las categorías');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    const token = getAuthToken();
    if (!token) {
      setShowLoginForm(true);
      return;
    }
    router.push(`/buscar-categorias?categoria_id=${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-white">Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#e94b5a]">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-[#2d1830]/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
          onClick={() => handleCategoryClick(category.id)}
        >
          <div className="relative h-48">
  
              alt={category.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {category.nombre}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">
                Desde ${category.precio}/día
              </span>
              <button className="px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors">
                Ver más
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 