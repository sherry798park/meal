/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Meal } from "../types";
import { formatKoreanDate } from "../utils/dateUtils";
import { Heart, Sun, Moon, Flame } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  today: Date;
  selectedDate: Date;
  isWeekend: boolean;
  lunchMeal: Meal;
  dinnerMeal: Meal;
  userAllergies: string[];
}

export default function HomeView({
  today,
  selectedDate,
  isWeekend,
  lunchMeal,
  dinnerMeal,
  userAllergies
}: HomeViewProps) {
  const [favorite, setFavorite] = useState<boolean>(true);

  // Check if a dishes array or allergens array contains any of the allergic items
  const containsAllergen = (allergensList: string[], item: string) => {
    return allergensList.includes(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Weekend Banner Alert if weekend */}
      {isWeekend && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex flex-col gap-1 shadow-sm leading-tight">
          <p className="font-gmarket-bold font-bold text-sm text-[#4F6F00] flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4F6F00] animate-pulse"></span>
            다음 급식 미리보기
          </p>
          <p className="font-gmarket-light text-xs text-stone-600 mt-1">
            오늘은 편안한 주말입니다! 다음 급식일인 <span className="font-bold text-stone-800">{formatKoreanDate(selectedDate)}</span> 식단을 미리 확인하세요.
          </p>
        </div>
      )}

      {/* Hero Card */}
      <section id="hero-meal-card" className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col border border-[#f1eee6]">
        <div className="relative w-full h-56 bg-[#ebe8e0] overflow-hidden">
          <img
            src={lunchMeal.featuredImage}
            alt={lunchMeal.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          {/* Recommendation tag */}
          <div className="absolute top-4 left-4 bg-red-100 text-[#ba1a1a] font-bold text-[11px] font-gmarket-bold tracking-wider px-3.5 py-1.5 rounded-full border border-red-200 backdrop-blur-sm shadow-md">
            오늘의 추천 급식
          </div>

          {/* Next Meal Badge for Weekend */}
          {isWeekend && (
            <div className="absolute top-4 left-36 bg-[#4F6F00] text-white font-bold text-[11px] font-gmarket-bold tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-md">
              다음 급식일
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={() => setFavorite(!favorite)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md text-[#4F6F00] hover:bg-white active:scale-90 transition-all duration-200"
          >
            <Heart
              className={`w-5 h-5 transition-transform ${favorite ? "fill-current scale-110 text-red-500" : ""}`}
            />
          </button>
        </div>

        <div className="p-card-padding flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-gmarket-light text-xs text-stone-500 tracking-wide font-medium">
                {formatKoreanDate(selectedDate)}
              </p>
              <h2 className="font-gmarket-bold text-lg font-bold text-[#4F6F00] mt-1.5 tracking-tight">
                {lunchMeal.title}
              </h2>
            </div>
            <div className="bg-[#d2ea7a]/30 text-[#4F6F00] px-3.5 py-1.5 rounded-full font-bold text-[12px] font-gmarket-bold flex items-center gap-1 border border-[#d2ea7a]/50">
              <Flame className="w-4 h-4 text-[#4F6F00] fill-current" />
              {lunchMeal.totalCalories} kcal
            </div>
          </div>
          <p className="font-gmarket-light text-xs leading-relaxed text-stone-600 mt-2 font-medium">
            {lunchMeal.description ||
              "우리 학교 영양사 선생님들이 엄선한 유기농 식자재로 정성스럽게 밥을 짓고 영양소를 맞춘 균형 잡힌 명품 식단입니다. 최고의 하루를 위해 맛있게 드세요!"}
          </p>
        </div>
      </section>

      {/* Today's Meals */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-gmarket-bold text-base font-bold text-stone-900">오늘의 식사 구성</h3>
          <span className="bg-[#ebe8e0] text-stone-600 font-bold text-[11px] font-gmarket-bold px-3 py-1 rounded-full">
            중식 & 석식
          </span>
        </div>

        {/* Lunch Card */}
        <article className="bg-white rounded-2xl shadow-card p-card-padding border border-[#e5e2db]/80 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4F6F00]"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#4F6F00]">
              <Sun className="w-5 h-5 fill-current text-[#4F6F00]" />
              <h4 className="font-gmarket-bold text-sm font-bold text-[#4F6F00] tracking-wide">중식 (Lunch)</h4>
            </div>
            <span className="font-gmarket-light text-xs text-stone-400 font-medium">11:30 - 13:00</span>
          </div>

          <ul className="flex flex-col gap-2.5 font-gmarket-medium text-[13px] text-stone-800 mb-4 font-medium pl-1">
            {lunchMeal.dishes.map((dish, idx) => {
              // Highlight highlight/signature dishes with bold text & darker bullet points
              const isHighlight = idx === 2; // e.g. "매콤돈육강정" or pork cutlet
              return (
                <li key={idx} className={`flex items-center gap-2 ${isHighlight ? "font-bold text-[#4F6F00]" : ""}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isHighlight ? "bg-[#4F6F00]" : "bg-[#d2ea7a]"}`}></div>
                  <span>{dish}</span>
                </li>
              );
            })}
          </ul>

          {/* Underline boundary allergen indicators with attention to user selected settings */}
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#e5e2db]/50">
            {lunchMeal.allergens.map((allergen, idx) => {
              const hasAlert = userAllergies.includes(allergen);
              return (
                <span
                  key={idx}
                  className={`font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-full border ${
                    hasAlert
                      ? "bg-red-50 text-red-600 border-red-200 shadow-sm font-extrabold"
                      : "bg-[#ebe8e0] text-stone-600 border-none"
                  }`}
                >
                  {allergen}
                  {hasAlert && " ⚠️"}
                </span>
              );
            })}
          </div>
        </article>

        {/* Dinner Card */}
        <article className="bg-white rounded-2xl shadow-card p-card-padding border border-[#e5e2db]/80 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d2ea7a]"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-stone-700">
              <Moon className="w-5 h-5 fill-current text-purple-600" />
              <h4 className="font-gmarket-bold text-sm font-bold text-stone-800 tracking-wide">석식 (Dinner)</h4>
            </div>
            <span className="font-gmarket-light text-xs text-stone-400 font-medium">17:30 - 18:30</span>
          </div>

          <ul className="flex flex-col gap-2.5 font-gmarket-medium text-[13px] text-stone-800 mb-4 font-medium pl-1">
            {dinnerMeal.dishes.map((dish, idx) => {
              const isHighlight = idx === 0; // e.g. "참치마요덮밥"
              return (
                <li key={idx} className={`flex items-center gap-2 ${isHighlight ? "font-bold text-[#485229]" : ""}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isHighlight ? "bg-[#485229]" : "bg-stone-300"}`}></div>
                  <span>{dish}</span>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#e5e2db]/50">
            {dinnerMeal.allergens.map((allergen, idx) => {
              const hasAlert = userAllergies.includes(allergen);
              return (
                <span
                  key={idx}
                  className={`font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-full border ${
                    hasAlert
                      ? "bg-red-50 text-red-600 border-red-200 shadow-sm font-extrabold"
                      : "bg-[#ebe8e0] text-stone-600 border-none"
                  }`}
                >
                  {allergen}
                  {hasAlert && " ⚠️"}
                </span>
              );
            })}
          </div>
        </article>
      </section>

      {/* Wholesome Nutritive Progress Bar */}
      <section className="bg-gradient-to-r from-[#d2ea7a]/20 to-[#4F6F00]/10 rounded-2xl p-4 border border-[#4F6F00]/10 text-stone-800 flex flex-col gap-1 shadow-sm mt-2">
        <h4 className="font-gmarket-bold text-xs font-bold text-[#4F6F00] flex items-center gap-1.5">
          <span>💡</span> 오늘의 영양 가이드
        </h4>
        <p className="font-gmarket-light text-[11px] leading-relaxed text-stone-600 mt-1">
          오늘 하루 식단은 <span className="font-bold text-[#4F6F00]">탄수화물, 단백질, 지방</span> 비율이 완벽하게 7:2:1 균형 식품군을 갖춘 성장기 우수 식단입니다. 씨마스 학생들의 근육 성장과 뇌의 피로 회복을 돕는 필수 비타민 B군과 단백질 성분이 듬뿍 함유되어 있습니다.
        </p>
      </section>
    </motion.div>
  );
}
