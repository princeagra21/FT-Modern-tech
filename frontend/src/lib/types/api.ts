// User interface
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Post interface
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Comment interface
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Album interface
export interface Album {
  userId: number;
  id: number;
  title: string;
}

// Photo interface
export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Todo interface
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Auth types
export interface AuthUser {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginResponse {
  user: AuthUser;
  message?: string;
  token?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}
