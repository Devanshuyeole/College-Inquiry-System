// src/hooks/useDataStore.ts - Custom hooks with backend integration

import { useState, useEffect } from 'react';
import { dataStore, Course, Department } from '@/lib/dataStore';

const API_URL = 'http://localhost:3001/api';

export function useCourses(): Course[] {
  const [courses, setCourses] = useState<Course[]>(dataStore.getCourses());

  useEffect(() => {
    // Fetch courses from backend on mount
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const data = await response.json();
          // Map MongoDB data to frontend format
          const mappedCourses: Course[] = data.map((course: any) => ({
            ...course,
            id: course._id || course.id || Date.now(),
            _id: course._id,
            title: course.title || course.name || '',
            description: course.description || '',
            category: course.category || course.department || '',
            duration: course.duration || '',
            seats: course.seats || '',
            fee: course.fee || ''
          }));
          dataStore.setCourses(mappedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();

    // Subscribe to changes
    const unsubscribe = dataStore.subscribe(() => {
      setCourses(dataStore.getCourses());
    });

    return unsubscribe;
  }, []);

  return courses;
}

export function useDepartments(): Department[] {
  const [departments, setDepartments] = useState<Department[]>(dataStore.getDepartments());

  useEffect(() => {
    // Fetch departments from backend on mount
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}/departments`);
        if (response.ok) {
          const data = await response.json();
          // Map MongoDB data to frontend format
          const mappedDepartments: Department[] = data.map((dept: any) => ({
            ...dept,
            id: dept._id || dept.id || Date.now(),
            _id: dept._id,
            name: dept.name || '',
            head: dept.head || '',
            faculty: dept.faculty || 0,
            programs: dept.programs || [],
            email: dept.email || ''
          }));
          dataStore.setDepartments(mappedDepartments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();

    // Subscribe to changes
    const unsubscribe = dataStore.subscribe(() => {
      setDepartments(dataStore.getDepartments());
    });

    return unsubscribe;
  }, []);

  return departments;
}