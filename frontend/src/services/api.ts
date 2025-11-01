import { apiClient } from '@/lib/api';
import {
  User,
  Post,
  Comment,
  Album,
  Photo,
  Todo,
  LoginResponse,
} from '@/lib/types/api';


//auth API
export const authApi = {
  // Login user
  login: (credentials: { identifier: string; password: string }) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),
  
}




// Posts API
export const postsApi = {
  // Get all posts
  getAllPosts: () => apiClient.get<Post[]>('/posts'),
  
  // Get post by ID
  getPost: (id: number) => apiClient.get<Post>(`/posts/${id}`),
  
  // Get posts by user ID
  getPostsByUser: (userId: number) => apiClient.get<Post[]>(`/posts?userId=${userId}`),
  
  // Create new post
  createPost: (post: Omit<Post, 'id'>) => apiClient.post<Post>('/posts', post),
  
  // Update post
  updatePost: (id: number, post: Partial<Post>) => apiClient.put<Post>(`/posts/${id}`, post),
  
  // Delete post
  deletePost: (id: number) => apiClient.delete<object>(`/posts/${id}`),
  
  // Get comments for a post
  getPostComments: (postId: number) => apiClient.get<Comment[]>(`/posts/${postId}/comments`),
};

// Comments API
export const commentsApi = {
  // Get all comments
  getAllComments: () => apiClient.get<Comment[]>('/comments'),
  
  // Get comment by ID
  getComment: (id: number) => apiClient.get<Comment>(`/comments/${id}`),
  
  // Get comments by post ID
  getCommentsByPost: (postId: number) => apiClient.get<Comment[]>(`/comments?postId=${postId}`),
  
  // Create new comment
  createComment: (comment: Omit<Comment, 'id'>) => apiClient.post<Comment>('/comments', comment),
  
  // Update comment
  updateComment: (id: number, comment: Partial<Comment>) => apiClient.put<Comment>(`/comments/${id}`, comment),
  
  // Delete comment
  deleteComment: (id: number) => apiClient.delete<object>(`/comments/${id}`),
};

// Albums API
export const albumsApi = {
  // Get all albums
  getAllAlbums: () => apiClient.get<Album[]>('/albums'),
  
  // Get album by ID
  getAlbum: (id: number) => apiClient.get<Album>(`/albums/${id}`),
  
  // Get albums by user ID
  getAlbumsByUser: (userId: number) => apiClient.get<Album[]>(`/albums?userId=${userId}`),
  
  // Create new album
  createAlbum: (album: Omit<Album, 'id'>) => apiClient.post<Album>('/albums', album),
  
  // Update album
  updateAlbum: (id: number, album: Partial<Album>) => apiClient.put<Album>(`/albums/${id}`, album),
  
  // Delete album
  deleteAlbum: (id: number) => apiClient.delete<object>(`/albums/${id}`),
  
  // Get photos for an album
  getAlbumPhotos: (albumId: number) => apiClient.get<Photo[]>(`/albums/${albumId}/photos`),
};

// Photos API
export const photosApi = {
  // Get all photos
  getAllPhotos: () => apiClient.get<Photo[]>('/photos'),
  
  // Get photo by ID
  getPhoto: (id: number) => apiClient.get<Photo>(`/photos/${id}`),
  
  // Get photos by album ID
  getPhotosByAlbum: (albumId: number) => apiClient.get<Photo[]>(`/photos?albumId=${albumId}`),
  
  // Create new photo
  createPhoto: (photo: Omit<Photo, 'id'>) => apiClient.post<Photo>('/photos', photo),
  
  // Update photo
  updatePhoto: (id: number, photo: Partial<Photo>) => apiClient.put<Photo>(`/photos/${id}`, photo),
  
  // Delete photo
  deletePhoto: (id: number) => apiClient.delete<object>(`/photos/${id}`),
};

// Todos API
export const todosApi = {
  // Get all todos
  getAllTodos: () => apiClient.get<Todo[]>('/todos'),
  
  // Get todo by ID
  getTodo: (id: number) => apiClient.get<Todo>(`/todos/${id}`),
  
  // Get todos by user ID
  getTodosByUser: (userId: number) => apiClient.get<Todo[]>(`/todos?userId=${userId}`),
  
  // Create new todo
  createTodo: (todo: Omit<Todo, 'id'>) => apiClient.post<Todo>('/todos', todo),
  
  // Update todo
  updateTodo: (id: number, todo: Partial<Todo>) => apiClient.put<Todo>(`/todos/${id}`, todo),
  
  // Delete todo
  deleteTodo: (id: number) => apiClient.delete<object>(`/todos/${id}`),
};

// Users API
export const usersApi = {
  // Get all users
  getAllUsers: () => apiClient.get<User[]>('/users'),
  
  // Get user by ID
  getUser: (id: number) => apiClient.get<User>(`/users/${id}`),
  
  // Create new user
  createUser: (user: Omit<User, 'id'>) => apiClient.post<User>('/users', user),
  
  // Update user
  updateUser: (id: number, user: Partial<User>) => apiClient.put<User>(`/users/${id}`, user),
  
  // Delete user
  deleteUser: (id: number) => apiClient.delete<object>(`/users/${id}`),
  
  // Get user's posts
  getUserPosts: (userId: number) => apiClient.get<Post[]>(`/users/${userId}/posts`),
  
  // Get user's albums
  getUserAlbums: (userId: number) => apiClient.get<Album[]>(`/users/${userId}/albums`),
  
  // Get user's todos
  getUserTodos: (userId: number) => apiClient.get<Todo[]>(`/users/${userId}/todos`),
};

// Export all APIs as a single object for convenience
export const api = {
  posts: postsApi,
  comments: commentsApi,
  albums: albumsApi,
  photos: photosApi,
  todos: todosApi,
  users: usersApi,
  auth: authApi,
};
