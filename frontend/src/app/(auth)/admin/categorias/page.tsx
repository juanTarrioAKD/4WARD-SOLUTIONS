'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Category, getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categories';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import { getCurrentUser } from '@/services/auth';
import BackButton from '@/components/common/BackButton';

export default function GestionCategorias() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      if (!user || user.rol !== 3) {
        router.push('/');
      }
    };

    checkAuth();
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError('Error al cargar las categorías');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createCategory(data);
      await fetchCategories();
      setShowForm(false);
    } catch (error) {
      setError('Error al crear la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedCategory) return;

    try {
      setIsSubmitting(true);
      await updateCategory(selectedCategory.id, data);
      await fetchCategories();
      setShowForm(false);
      setSelectedCategory(null);
    } catch (error) {
      setError('Error al actualizar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsSubmitting(true);
      await deleteCategory(id);
      await fetchCategories();
      setShowDeleteConfirm(null);
    } catch (error) {
      setError('Error al eliminar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3d2342] p-8">
        <div className="text-center">
          <p className="text-white text-xl">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3d2342] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gestión de Categorías</h1>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
          >
            Nueva Categoría
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
            {error}
          </div>
        )}

        {showForm ? (
          <div className="bg-[#2d1830] p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <CategoryForm
              category={selectedCategory || undefined}
              onSubmit={selectedCategory ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setSelectedCategory(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-[#2d1830] rounded-lg overflow-hidden shadow-xl"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image || '/default-category.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-[#a16bb7] mb-4">
                    {category.description || 'Sin descripción'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-[#3d2342] px-3 py-1 rounded-full text-white text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">
                      ${category.price}/día
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowForm(true);
                        }}
                        className="px-4 py-2 bg-[#a16bb7] text-white rounded-md hover:bg-[#8a5b9d] transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(category.id)}
                        className="px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2d1830] p-8 rounded-lg shadow-xl z-50 w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Confirmar Eliminación</h3>
            <p className="text-[#a16bb7] mb-6">
              ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-white hover:text-[#e94b5a] transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </>
      )}

      <BackButton />
    </div>
  );
} 