/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NutritionInfo {
  kcal: number;
  protein: number;      // in grams (g)
  carbohydrates: number; // in grams (g)
  fat: number;           // in grams (g)
}

export interface DishItem {
  name: string;
  kcal: number;
  category: "밥류" | "국/찌개" | "반찬" | "디저트";
}

export interface Meal {
  id: string;
  schoolName: string;
  dateStr: string;      // "2026-05-21" representation
  dateKey: string;      // "YYYYMMDD" representation
  dayOfWeek: string;    // "월요일", "화요일", etc.
  mealType: "lunch" | "dinner";
  title: string;        // Main card title, e.g., "치즈돈까스 정식"
  dishes: string[];     // Array of dish names for simple list
  dishItems?: DishItem[]; // Detailed dish items for nutrition view
  totalCalories: number;
  nutrition: NutritionInfo;
  allergens: string[];  // e.g., ["대두", "밀", "쇠고기", "돼지고기"]
  featuredImage?: string; // Image URL for featured card
  description?: string;  // Detailed meal explanation
}

export interface WeeklyMeals {
  [dateKey: string]: {
    lunch: Meal;
    dinner: Meal;
  };
}
