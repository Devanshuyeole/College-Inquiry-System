// dataStore.ts - Centralized data management with empty initial state

export interface Course {
  id: number | string;
  _id?: string; // MongoDB ID
  title: string;
  description: string;
  category: string;
  duration: string;
  seats: string;
  fee: string;
  fullDescription?: string;
  feeStructure?: any;
  faculty?: any[];
  admissionCriteria?: any;
  news?: any[];
}

export interface Department {
  id: number | string;
  _id?: string; // MongoDB ID
  name: string;
  head: string;
  faculty: number;
  programs: string[];
  email: string;
}

class DataStore {
  private courses: Course[] = [];
  private departments: Department[] = [];
  private listeners: Set<() => void> = new Set();

  getCourses(): Course[] {
    return this.courses;
  }

  setCourses(courses: Course[]): void {
    this.courses = courses;
    this.notifyListeners();
  }

  getDepartments(): Department[] {
    return this.departments;
  }

  setDepartments(departments: Department[]): void {
    this.departments = departments;
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const dataStore = new DataStore();