interface ErrorResponse {
  message: string;
}

export const apiFetch = async <T>(url: string, method = 'POST', body: any = null): Promise<T> => {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const responseData: ErrorResponse = await response.json();
      throw new Error(responseData.message || 'An error occurred');
    }

    return await response.json() as T; // Cast response as the expected type
  } catch (error) {
    throw error; 
  }
};
