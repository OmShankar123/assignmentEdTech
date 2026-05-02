export interface Instructor {
  id: number;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface InstructorsResponse {
  data: {
    data: Instructor[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  mainImage: {
    url: string;
    localPath: string;
    _id: string;
  };
  subImages: {
    url: string;
    localPath: string;
    _id: string;
  }[];
  stock: number;
  instructor?: Instructor;
  progress?: number;
}

export interface CoursesResponse {
  data: {
    products: Course[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}
