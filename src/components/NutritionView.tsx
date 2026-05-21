/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Meal, DishItem } from "../types";
import { Calculator, Check, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NutritionViewProps {
  selectedMeals: { lunch: Meal; dinner: Meal };
}

export default function NutritionView({ selectedMeals }: NutritionViewProps) {
  // Let the user switch between Lunch items or Dinner items for calculation
  const [mealType, setMealType] = useState<"lunch" | "dinner">("lunch");
  const activeMeal = mealType === "lunch" ? selectedMeals.lunch : selectedMeals.dinner;

  // Active category filter
  const [categoryFilter, setCategoryFilter] = useState<string>("전체");

  // Track checked state of individual dishes (Default: all items are checked initially)
  const [checkedDishes, setCheckedDishes] = useState<{ [dishName: string]: boolean }>({});

  // Reset checked dishes whenever the active meal changes or user switches meal type
  useEffect(() => {
    const initialChecked: { [dishName: string]: boolean } = {};
    activeMeal.dishes.forEach((dish) => {
      initialChecked[dish] = true; // Default to checked
    });
    setCheckedDishes(initialChecked);
  }, [selectedMeals, mealType]);

  // Handle checking / unchecking
  const toggleDish = (dishName: string) => {
    setCheckedDishes((prev) => ({
      ...prev,
      [dishName]: !prev[dishName]
    }));
  };

  // Helper to obtain dynamic details
  const getDishDetails = (dishName: string): DishItem & { protein: number; carb: number; fat: number } => {
    // Generate detailed nutrition dynamically for individual dishes in order to sum up nicely
    // If the dish has predefined custom values, use them, otherwise assign fractional values of the total meal calorie.
    const baseDetails = activeMeal.dishItems?.find((item) => item.name === dishName);
    const kcal = baseDetails?.kcal || 150;
    const category = baseDetails?.category || "반찬";

    // Distribute protein, carb, fat proportionally according to dish size:
    let protein = 2; // default
    let carb = 15;
    let fat = 1;

    if (category === "밥류") {
      carb = Math.round(kcal / 3.5);
      protein = Math.round(kcal / 50) + 2;
      fat = 1;
    } else if (category === "국/찌개") {
      carb = Math.round(kcal / 12);
      protein = Math.round(kcal / 15);
      fat = Math.round(kcal / 30);
    } else if (category === "반찬") {
      carb = Math.round(kcal / 10);
      protein = Math.round(kcal / 25);
      fat = Math.round(kcal / 20);
    } else if (category === "디저트") {
      carb = Math.round(kcal / 5);
      protein = 1;
      fat = 1;
    }

    return { name: dishName, kcal, category, protein, carb, fat };
  };

  // Compute aggregated nutritional values
  let cumulativeCalories = 0;
  let cumulativeProtein = 0;
  let cumulativeCarbs = 0;
  let cumulativeFat = 0;

  activeMeal.dishes.forEach((dish) => {
    if (checkedDishes[dish]) {
      const details = getDishDetails(dish);
      cumulativeCalories += details.kcal;
      cumulativeProtein += details.protein;
      cumulativeCarbs += details.carb;
      cumulativeFat += details.fat;
    }
  });

  // Calculate percentage caps for visual progress bars based on RDA guidelines
  const targetProtein = 50; // g
  const targetCarbs = 130;  // g
  const targetFat = 65;     // g

  const proteinPct = Math.min(Math.round((cumulativeProtein / targetProtein) * 100), 100);
  const carbsPct = Math.min(Math.round((cumulativeCarbs / targetCarbs) * 100), 100);
  const fatPct = Math.min(Math.round((cumulativeFat / targetFat) * 100), 100);

  // Handle custom filter category
  const categoriesList = ["전체", "밥류", "국/찌개", "반찬", "디저트"];

  // Filtered list of dishes based on category
  const filteredDishes = activeMeal.dishes.filter((dish) => {
    if (categoryFilter === "전체") return true;
    const details = getDishDetails(dish);
    return details.category === categoryFilter;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saveCalculation = () => {
    const savedData = {
      mealType,
      dateKey: activeMeal.dateKey,
      calories: cumulativeCalories,
      protein: cumulativeProtein,
      carbohydrates: cumulativeCarbs,
      fat: cumulativeFat,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("cmas_nutrition_calc", JSON.stringify(savedData));
    setToastMessage("체크된 식단의 계산 결과가 회원님의 건강 다이어리에 정상 저장되었습니다!");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 left-4 right-4 z-50 bg-[#4F6F00] text-white p-4 rounded-xl text-xs font-gmarket-medium text-center shadow-lg leading-snug border border-[#d2ea7a]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selector of Meal Type (Lunch vs Dinner) */}
      <div className="bg-white/80 p-1 rounded-full border border-[#f1eee6] flex items-center shadow-sm">
        <button
          onClick={() => setMealType("lunch")}
          className={`flex-1 text-center py-2.5 rounded-full font-gmarket-bold text-xs font-bold transition-all ${
            mealType === "lunch" ? "bg-[#4F6F00] text-white shadow-sm" : "text-stone-600 hover:text-stone-900"
          }`}
        >
          ☀️ 중식 계산원
        </button>
        <button
          onClick={() => setMealType("dinner")}
          className={`flex-1 text-center py-2.5 rounded-full font-gmarket-bold text-xs font-bold transition-all ${
            mealType === "dinner" ? "bg-[#485229] text-white shadow-sm" : "text-stone-600 hover:text-stone-900"
          }`}
        >
          🌙 석식 계산원
        </button>
      </div>

      {/* Aggregate Scorecard Card */}
      <section className="bg-white rounded-[24px] p-card-padding shadow-card flex flex-col gap-4 border border-[#e5e2db]/50 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-gmarket-bold text-base font-bold text-stone-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#4F6F00]" />
            오늘의 선택 영양 집계
          </h2>
        </div>

        <div className="flex items-end gap-1.5 mb-2-base pl-1">
          <span className="font-gmarket-bold text-3xl font-extrabold text-[#4F6F00] leading-none">
            {cumulativeCalories}
          </span>
          <span className="font-gmarket-light text-sm text-stone-400 font-medium pb-0.5">kcal</span>
        </div>

        {/* Nutritional Horizontal Sliders */}
        <div className="flex flex-col gap-4 mt-2">
          {/* Protein */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full">
              <span className="font-gmarket-light text-xs text-stone-500 font-medium">단백질 (Protein)</span>
              <span className="font-gmarket-bold text-xs font-bold text-[#4F6F00]">{cumulativeProtein}g ({proteinPct}%)</span>
            </div>
            <div className="w-full h-2 bg-[#ebe8e0] rounded-full overflow-hidden">
              <div className="h-full bg-[#485229] rounded-full transition-all duration-300" style={{ width: `${proteinPct}%` }}></div>
            </div>
          </div>
          {/* Carbs */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full">
              <span className="font-gmarket-light text-xs text-stone-500 font-medium">탄수화물 (Carbs)</span>
              <span className="font-gmarket-bold text-xs font-bold text-[#4F6F00]">{cumulativeCarbs}g ({carbsPct}% )</span>
            </div>
            <div className="w-full h-2 bg-[#ebe8e0] rounded-full overflow-hidden">
              <div className="h-full bg-[#d2ea7a] rounded-full transition-all duration-300" style={{ width: `${carbsPct}%` }}></div>
            </div>
          </div>
          {/* Fat */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full">
              <span className="font-gmarket-light text-xs text-stone-500 font-medium">지방 (Fats)</span>
              <span className="font-gmarket-bold text-xs font-bold text-[#4F6F00]">{cumulativeFat}g ({fatPct}%)</span>
            </div>
            <div className="w-full h-2 bg-[#ebe8e0] rounded-full overflow-hidden">
              <div className="h-full bg-[#c1cc98] rounded-full transition-all duration-300" style={{ width: `${fatPct}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Filter and List checkboxes */}
      <section className="flex flex-col gap-4">
        {/* Categories scrollable rail */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1.5 -mx-margin-mobile px-margin-mobile">
          {categoriesList.map((cat, idx) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={idx}
                onClick={() => setCategoryFilter(cat)}
                className={`shrink-0 font-gmarket-bold text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 border ${
                  isActive
                    ? "bg-[#4F6F00] text-white border-transparent"
                    : "bg-white text-stone-500 border-[#e5e2db] hover:bg-stone-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* List of Checkbox choices */}
        <div className="flex flex-col gap-3">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish, idx) => {
              const details = getDishDetails(dish);
              const isChecked = !!checkedDishes[dish];

              return (
                <div
                  key={idx}
                  onClick={() => toggleDish(dish)}
                  className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    isChecked
                      ? "bg-[#f1eee6]/50 border-[#4F6F00] shadow-sm transform scale-[0.99]"
                      : "bg-white border-[#ebe8e0] shadow-sm hover:border-[#c1cc98]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-gmarket-bold text-[14px] text-stone-900 font-bold flex items-center gap-2">
                      {dish}
                      <span className="text-[10px] bg-stone-100 text-[#747967] px-2 py-0.5 rounded-md font-normal font-gmarket-light">
                        {details.category}
                      </span>
                    </span>
                    <span className="font-gmarket-light text-xs text-stone-400 mt-1">
                      {details.kcal} kcal · 단 {details.protein}g 탄 {details.carb}g 지 {details.fat}g
                    </span>
                  </div>

                  {/* Dynamic circular checkbox indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isChecked ? "bg-[#4F6F00] text-white" : "border-2 border-stone-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center text-stone-400 text-xs font-gmarket-light">
              해당 카테고리의 반찬 메뉴가 식단표에 존재하지 않습니다!
            </div>
          )}
        </div>
      </section>

      {/* Button widget for saving calculation results */}
      <footer className="mt-4">
        <button
          onClick={saveCalculation}
          className="w-full bg-[#4F6F00] hover:bg-[#4F6F00]/90 text-white font-gmarket-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-200"
        >
          <Save className="w-5 h-5 text-white" />
          계산 결과 회원 수첩에 저장하기
        </button>
      </footer>
    </motion.div>
  );
}
