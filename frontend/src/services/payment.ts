import { API_BASE_URL } from '@/config/config';

export const createPaymentPreference = async (alquiler_id: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pagos/crear-preferencia/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ alquiler_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear la preferencia de pago');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear preferencia de pago:', error);
    throw error;
  }
}; 