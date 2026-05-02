export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CoursesResponse {
  data: {
    data: Course[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}
