interface Category {
  id: number;
  name: string;
  image: string;
  price: number;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/categorias/', {
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
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Función auxiliar para manejar las URLs de las imágenes
export const getImageUrl = (imageUrl: string): string => {
  return imageUrl.startsWith('http') ? imageUrl : `/${imageUrl}`;
}; 