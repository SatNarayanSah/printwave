const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export const fetchApi = async (endpoint: string, options: RequestOptions = {}) => {
  const { method = "GET", headers = {}, body } = options;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export const productsApi = {
  getAll: (page = 1, limit = 20, category?: string, search?: string) => {
    let url = `/products?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    return fetchApi(url);
  },
  getBySlug: (slug: string) => fetchApi(`/products/${slug}`),
};

export const authApi = {
  login: (credentials: any) => fetchApi("/auth/login", { method: "POST", body: credentials }),
  register: (userData: any) => fetchApi("/auth/register", { method: "POST", body: userData }),
};

export const cartApi = {
  get: () => fetchApi("/cart"),
  addItem: (item: any) => fetchApi("/cart/add", { method: "POST", body: item }),
  removeItem: (id: string) => fetchApi(`/cart/remove/${id}`, { method: "DELETE" }),
  sync: (items: any[]) => fetchApi("/cart/sync", { method: "POST", body: { items } }),
};

export const designsApi = {
  getCurrent: () => fetchApi("/designs"),
  upload: (formData: FormData) => {
    const token = localStorage.getItem("token");
    return fetch(`${API_BASE_URL}/designs`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id: string) => fetchApi(`/designs/${id}`, { method: "DELETE" }),
};

export const ordersApi = {
  create: (orderData: any) => fetchApi("/orders", { method: "POST", body: orderData }),
  getMyOrders: () => fetchApi("/orders"),
  getOne: (id: string) => fetchApi(`/orders/${id}`),
};

export const paymentsApi = {
  createSession: (orderId: string) => fetchApi("/payments/create-session", { method: "POST", body: { orderId } }),
  verify: (sessionId: string) => fetchApi("/payments/verify", { method: "POST", body: { sessionId } }),
};

export const reviewsApi = {
  create: (reviewData: any) => fetchApi("/reviews", { method: "POST", body: reviewData }),
  getForProduct: (productId: string) => fetchApi(`/reviews/product/${productId}`),
};
