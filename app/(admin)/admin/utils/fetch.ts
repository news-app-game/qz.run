import { refreshInstance } from '@/tools/refresh-instance';

interface FetchOptions extends RequestInit {
  baseURL?: string;
}

const handleUnauthorized = () => {
  refreshInstance.logout();
  window.location.href = '/login';
};

export async function adminFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const token = refreshInstance.getTokenValue();

  if (!token) {
    handleUnauthorized();
    throw new Error('No token found');
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const fullURL = `${baseURL}${url}`;
  const { body } = options;
  const isFormData = body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(fullURL, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }

  if (response.status === 422) {
    const data = await response.json();
    console.log(data);
    throw new Error(data.message || 'Request failed');
  }

  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
}
