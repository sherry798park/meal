/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  getTodayKST,
  getDefaultSelectedDate,
  getWeekDates,
  formatDateKey
} from "./utils/dateUtils";
import { generateWeeklyMeals } from "./data/mockData";
import HomeView from "./components/HomeView";
import ScheduleView from "./components/ScheduleView";
import NutritionView from "./components/NutritionView";
import ProfileView from "./components/ProfileView";
import {
  Utensils,
  Bell,
  Home,
  CalendarDays,
  Calculator,
  User,
  Heart
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  // Current tab state: "home" | "schedule" | "nutrition" | "profile"
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "nutrition" | "profile">("home");

  // Dynamic KST Today date setup
  const [today, setToday] = useState<Date>(() => getTodayKST());
  
  // Selected target date calculation
  const [selectedDate, setSelectedDate] = useState<Date>(() => getDefaultSelectedDate(getTodayKST()));
  
  // Allergens defined in student profile (Initialize with design defaults: Wood/Milk and Peanut)
  const [userAllergies, setUserAllergies] = useState<string[]>(() => {
    const saved = localStorage.getItem("cmas_allergies");
    return saved ? JSON.parse(saved) : ["우유", "땅콩"];
  });

  // Daily Meal notifications state
  const [mealNotification, setMealNotification] = useState<boolean>(true);

  // Sync allergens to localStorage
  const handleAddAllergy = (item: string) => {
    if (!userAllergies.includes(item)) {
      const updated = [...userAllergies, item];
      setUserAllergies(updated);
      localStorage.setItem("cmas_allergies", JSON.stringify(updated));
    }
  };

  const handleRemoveAllergy = (item: string) => {
    const updated = userAllergies.filter(a => a !== item);
    setUserAllergies(updated);
    localStorage.setItem("cmas_allergies", JSON.stringify(updated));
  };

  const handleToggleMealNotification = () => {
    setMealNotification(prev => !prev);
  };

  // Perform calculations for current weeks
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const currentWeekDates = getWeekDates(selectedDate);
  const weeklyMeals = generateWeeklyMeals(selectedDate);
  const selectedKey = formatDateKey(selectedDate);

  // Retrieve current active record meals
  const activeDayMeals = weeklyMeals[selectedKey] || {
    lunch: {
      id: "fallback_lunch",
      schoolName: "씨마스고등학교",
      dateStr: "",
      dateKey: selectedKey,
      dayOfWeek: "오늘",
      mealType: "lunch" as const,
      title: "수제 치즈돈까스 정식",
      dishes: ["식단을 준비 중입니다."],
      totalCalories: 820,
      nutrition: { kcal: 820, protein: 30, carbohydrates: 110, fat: 22 },
      allergens: [],
      featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL69e-ubBhPPvOEBllyYil1JdLP2dJdToJxkese9y9DiWxWMPMkoT4-pwmmbwlLMMXnjVBG6R3fIgQFTsTvLypujSXvUVlkE--CQyKT8BERLrW5ktmYaInjgyUZnaRSAE5scvfYpoNxNyJySFMnfZ2iNLuWmTn-uJqJ2QCFiXloQoS2q2PguKO1OKGMxUBpokq4Wx3LjERsjg1FsKI01qFtPcA_6XYRvhUw72bLyuTfiC53lacZ3zwGGCNX19u4Na2orzOHzHrTqHD"
    },
    dinner: {
      id: "fallback_dinner",
      schoolName: "씨마스고등학교",
      dateStr: "",
      dateKey: selectedKey,
      dayOfWeek: "오늘",
      mealType: "dinner" as const,
      title: "참치마요 소시지 오므라이스",
      dishes: ["저녁 소식 식단을 불러오지 못했습니다."],
      totalCalories: 710,
      nutrition: { kcal: 710, protein: 18, carbohydrates: 98, fat: 16 },
      allergens: []
    }
  };

  // Switch tabs smoothly and reset selection context to today if appropriate
  const handleTabChange = (tabName: "home" | "schedule" | "nutrition" | "profile") => {
    setActiveTab(tabName);
    // When going to home, default anchor back to KST today choice
    if (tabName === "home") {
      setSelectedDate(getDefaultSelectedDate(getTodayKST()));
    }
  };

  return (
    <div id="cmas-lunch-app-root" className="min-h-screen bg-[#FAF7EF] text-stone-800 transition-colors duration-300">
      {/* Top Header App Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#FAF7EF]/90 backdrop-blur-md z-40 border-b border-[#e5e2db] flex items-center justify-between px-6 max-w-[440px] mx-auto md:max-w-7xl md:px-12">
        <div 
          onClick={() => handleTabChange("home")}
          className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity"
        >
          <Utensils className="w-5 h-5 text-[#4F6F00] stroke-[2.5]" />
          <h1 className="font-gmarket-bold text-base font-bold text-[#4F6F00] tracking-tight">
            씨마스고등학교 급식
          </h1>
        </div>
        <button
          onClick={() => alert(`씨마스고등학교에 온 것을 환영합니다! 알림 설정 및 알레르기 관리 패널이 활성화되어 있습니다.`)} 
          className="text-[#4F6F00] hover:bg-[#ebe8e0] p-2 rounded-full transition-colors active:scale-95 duration-200"
        >
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Main Layout containing dynamic side navigational drawer on desktop split screens */}
      <div className="max-w-[440px] mx-auto pt-20 pb-28 px-5 md:max-w-7xl md:px-12 md:grid md:grid-cols-[240px_1fr] md:gap-12 md:pb-12">
        {/* Deskop Sidebar Nav (hidden on mobile targets) */}
        <nav className="hidden md:flex flex-col gap-3 sticky top-24 self-start bg-white/70 backdrop-blur-sm p-4 rounded-3xl border border-[#e5e2db] shadow-sm">
          <button
            onClick={() => handleTabChange("home")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-gmarket-bold text-xs font-bold transition-all duration-300 ${
              activeTab === "home"
                ? "bg-[#4F6F00] text-white shadow-md"
                : "text-stone-600 hover:bg-[#ebe8e0] hover:text-stone-900"
            }`}
          >
            <Home className="w-4 h-4" />
            홈 (오늘의 급식)
          </button>
          <button
            onClick={() => handleTabChange("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-gmarket-bold text-xs font-bold transition-all duration-300 ${
              activeTab === "schedule"
                ? "bg-[#4F6F00] text-white shadow-md"
                : "text-stone-600 hover:bg-[#ebe8e0] hover:text-stone-900"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            식단표 (주간 식단)
          </button>
          <button
            onClick={() => handleTabChange("nutrition")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-gmarket-bold text-xs font-bold transition-all duration-300 ${
              activeTab === "nutrition"
                ? "bg-[#4F6F00] text-white shadow-md"
                : "text-stone-600 hover:bg-[#ebe8e0] hover:text-stone-900"
            }`}
          >
            <Calculator className="w-4 h-4" />
            영양계산 (커스텀 영양)
          </button>
          <button
            onClick={() => handleTabChange("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-gmarket-bold text-xs font-bold transition-all duration-300 ${
              activeTab === "profile"
                ? "bg-[#4F6F00] text-white shadow-md"
                : "text-stone-600 hover:bg-[#ebe8e0] hover:text-stone-900"
            }`}
          >
            <User className="w-4 h-4" />
            프로필 (알레르기)
          </button>
        </nav>

        {/* Dynamic Display Area of Active View Screens */}
        <section className="flex-1 md:py-2">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <HomeView
                today={today}
                selectedDate={selectedDate}
                isWeekend={isWeekend}
                lunchMeal={activeDayMeals.lunch}
                dinnerMeal={activeDayMeals.dinner}
                userAllergies={userAllergies}
              />
            )}

            {activeTab === "schedule" && (
              <ScheduleView
                currentWeekDates={currentWeekDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                dayMeals={activeDayMeals}
              />
            )}

            {activeTab === "nutrition" && (
              <NutritionView
                selectedMeals={activeDayMeals}
              />
            )}

            {activeTab === "profile" && (
              <ProfileView
                userAllergies={userAllergies}
                onAddAllergy={handleAddAllergy}
                onRemoveAllergy={handleRemoveAllergy}
                mealNotification={mealNotification}
                onToggleMealNotification={handleToggleMealNotification}
              />
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop viewports) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FAF7EF]/90 backdrop-blur-md border-t border-[#e5e2db] h-20 px-4 flex justify-around items-center z-45 max-w-[440px] mx-auto shadow-nav rounded-t-2xl">
        <button
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-95 ${
            activeTab === "home"
              ? "bg-[#4F6F00] text-white px-5 py-1.5 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-gmarket-light text-[10px] mt-1 font-bold">홈</span>
        </button>

        <button
          onClick={() => handleTabChange("schedule")}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-95 ${
            activeTab === "schedule"
              ? "bg-[#4F6F00] text-white px-5 py-1.5 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="font-gmarket-light text-[10px] mt-1 font-bold">식단표</span>
        </button>

        <button
          onClick={() => handleTabChange("nutrition")}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-95 ${
            activeTab === "nutrition"
              ? "bg-[#4F6F00] text-white px-5 py-1.5 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="font-gmarket-light text-[10px] mt-1 font-bold">영양계산</span>
        </button>

        <button
          onClick={() => handleTabChange("profile")}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-95 ${
            activeTab === "profile"
              ? "bg-[#4F6F00] text-white px-5 py-1.5 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-gmarket-light text-[10px] mt-1 font-bold">프로필</span>
        </button>
      </nav>
    </div>
  );
}
