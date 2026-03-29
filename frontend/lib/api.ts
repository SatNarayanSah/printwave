const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  isFormData?: boolean;
};

/**
 * All requests use credentials:'include' so the httpOnly cookie (pw_token)
 * is sent automatically. No localStorage or sessionStorage is used.
 */
export const fetchApi = async (endpoint: string, options: RequestOptions = {}) => {
  const { method = "GET", headers = {}, body, isFormData = false } = options;

  const config: RequestInit = {
    method,
    credentials: "include", // Send cookies with every request
    headers: isFormData ? headers : {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
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
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: () => fetchApi("/auth/me"),
  verifyEmail: (token: string) => fetchApi(`/auth/verify-email?token=${token}`),
};

export const cartApi = {
  get: () => fetchApi("/cart"),
  addItem: (item: any) => fetchApi("/cart/add", { method: "POST", body: item }),
  removeItem: (id: string) => fetchApi(`/cart/remove/${id}`, { method: "DELETE" }),
  sync: (items: any[]) => fetchApi("/cart/sync", { method: "POST", body: { items } }),
};

export const designsApi = {
  getCurrent: () => fetchApi("/designs"),
  upload: (formData: FormData) =>
    fetchApi("/designs", { method: "POST", body: formData, isFormData: true }),
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

export const adminApi = {
  getDashboardStats: () => fetchApi("/admin/dashboard"),
  getProducts: () => fetchApi("/admin/products"),
  createProduct: (data: any) => fetchApi("/admin/products", { method: "POST", body: data }),
  updateProduct: (id: string, data: any) => fetchApi(`/admin/products/${id}`, { method: "PUT", body: data }),
  deleteProduct: (id: string) => fetchApi(`/admin/products/${id}`, { method: "DELETE" }),
  getOrders: () => fetchApi("/admin/orders"),
  updateOrderStatus: (id: string, status: string) => fetchApi(`/admin/orders/${id}/status`, { method: "PUT", body: { status } }),
  getDesigns: () => fetchApi("/admin/designs"),
};
