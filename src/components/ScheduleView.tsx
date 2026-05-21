/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Meal } from "../types";
import {
  getWeekDates,
  getKoreanDayOfWeekShort,
  getWeekOfMonth,
  formatDateKey
} from "../utils/dateUtils";
import { Calendar, Sun, Moon, Dumbbell, Grid } from "lucide-react";
import { motion } from "motion/react";

interface ScheduleViewProps {
  currentWeekDates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dayMeals: { lunch: Meal; dinner: Meal };
}

export default function ScheduleView({
  currentWeekDates,
  selectedDate,
  onSelectDate,
  dayMeals
}: ScheduleViewProps) {
  const weekLabel = getWeekOfMonth(selectedDate);
  const selectedKey = formatDateKey(selectedDate);

  const { lunch, dinner } = dayMeals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Header Info */}
      <section className="flex items-end justify-between">
        <div>
          <h2 className="font-gmarket-bold text-2xl font-bold text-stone-900 tracking-tight">주간 식단</h2>
          <p className="font-gmarket-light text-sm font-medium text-stone-500 mt-1">{weekLabel}</p>
        </div>
        <button
          onClick={() => alert(`씨마스고등학교 ${weekLabel} 학사 일정 기준 식단 주차 일정표입니다!`)}
          className="bg-[#d2ea7a] hover:bg-[#d2ea7a]/90 text-[#4F6F00] font-bold text-xs font-gmarket-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform duration-200"
        >
          <Calendar className="w-4 h-4 text-[#4F6F00]" />
          전체보기
        </button>
      </section>

      {/* Date Selector (Mon to Fri) */}
      <section className="mb-2">
        <div className="flex gap-2.5 justify-between py-2 overflow-x-auto no-scrollbar">
          {currentWeekDates.map((date, idx) => {
            const dateKey = formatDateKey(date);
            const isSelected = dateKey === selectedKey;
            const dayName = getKoreanDayOfWeekShort(date);
            const dateNum = date.getDate();

            return (
              <button
                key={idx}
                onClick={() => onSelectDate(date)}
                className={`flex-1 min-w-[54px] py-3.5 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative ${
                  isSelected
                    ? "bg-[#4F6F00] text-white shadow-md active:scale-95"
                    : "bg-[#ebe8e0]/60 hover:bg-[#ebe8e0]/90 text-stone-700 active:scale-95"
                }`}
              >
                <span className={`font-medium text-xs font-gmarket-light ${isSelected ? "text-white/80" : "text-stone-500"}`}>
                  {dayName}
                </span>
                <span className="font-gmarket-bold text-base font-bold mt-1">
                  {dateNum}
                </span>
                {isSelected && (
                  <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-[#4F6F00] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Meal Detail Cards */}
      <section className="flex flex-col gap-5">
        {/* Lunch Card */}
        <article className="bg-white rounded-2xl shadow-card p-card-padding flex flex-col relative overflow-hidden border border-[#f1eee6]">
          {/* Subtle decoration */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d2ea7a]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 z-10">
            <div className="bg-[#d2ea7a]/40 text-[#4F6F00] px-3 py-1.5 rounded-lg font-bold text-xs font-gmarket-bold flex items-center gap-1.5">
              <Sun className="w-4 h-4 fill-current text-[#4F6F00]" />
              중식
            </div>
            <span className="font-gmarket-bold text-lg font-bold text-[#4F6F00]">
              {lunch.totalCalories} <span className="font-gmarket-light text-xs text-stone-500 font-normal">kcal</span>
            </span>
          </div>

          <h3 className="font-gmarket-bold text-md font-bold text-stone-900 mb-3 pl-1 leading-tight border-l-4 border-[#4F6F00] pl-2.5">
            {lunch.title}
          </h3>

          <ul className="flex flex-col gap-3 mb-5 pl-2 z-10">
            {lunch.dishes.map((dish, idx) => {
              // Mark signature meats or high-protein targets with custom tags
              const allergensInThisDish = lunch.allergens.filter(a => dish.includes(a) || (a === "돼지고기" && dish.includes("돈육")) || (a === "쇠고기" && dish.includes("미역국")));
              const isPrime = idx === 0 || idx === 2; // grains & main component
              return (
                <li key={idx} className="flex items-start justify-between py-0.5">
                  <span className={`text-[13px] font-gmarket-light ${isPrime ? "font-bold text-stone-800" : "text-stone-600"}`}>
                    {dish}
                  </span>
                  {allergensInThisDish.length > 0 && (
                    <div className="flex gap-1">
                      {allergensInThisDish.map((alg, aIdx) => (
                        <span key={aIdx} className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold text-[9px] font-gmarket-bold border border-red-100">
                          {alg}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Protein Bar Chart representation from design mock */}
          <div className="mt-2 bg-[#FAF7EF] rounded-xl p-3.5 z-10 border border-[#e5e2db]/50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gmarket-light text-xs font-medium text-stone-500 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-[#4F6F00]" />
                단백질 권장량 달성률
              </span>
              <span className="font-gmarket-bold text-xs font-bold text-[#4F6F00]">85%</span>
            </div>
            <div className="w-full bg-[#ebe8e0] rounded-full h-2 overflow-hidden">
              <div className="bg-[#4F6F00] h-full rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
            </div>
          </div>
        </article>

        {/* Dinner Card */}
        <article className="bg-white rounded-2xl shadow-card p-card-padding flex flex-col relative overflow-hidden border border-[#f1eee6]">
          {/* Subtle decoration */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#485229]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 z-10">
            <div className="bg-[#ebe8e0]/60 text-stone-600 px-3 py-1.5 rounded-lg font-bold text-xs font-gmarket-bold flex items-center gap-1.5">
              <Moon className="w-4 h-4 fill-current text-indigo-500" />
              석식
            </div>
            <span className="font-gmarket-bold text-[#747967] text-lg font-bold">
              {dinner.totalCalories} <span className="font-gmarket-light text-xs text-stone-400 font-normal">kcal</span>
            </span>
          </div>

          <h3 className="font-gmarket-bold text-md font-bold text-stone-800 mb-3 pl-1 leading-tight border-l-4 border-[#d2ea7a] pl-2.5">
            {dinner.title}
          </h3>

          <ul className="flex flex-col gap-3 mb-5 pl-2 z-10">
            {dinner.dishes.map((dish, idx) => {
              const alloys = dinner.allergens.filter(a => dish.includes(a) || (a === "돼지고기" && dish.includes("소시지")));
              const isPrime = idx === 0;
              return (
                <li key={idx} className="flex items-start justify-between py-0.5">
                  <span className={`text-[13px] font-gmarket-light ${isPrime ? "font-bold text-stone-800" : "text-stone-600"}`}>
                    {dish}
                  </span>
                  {alloys.length > 0 && (
                    <div className="flex gap-1">
                      {alloys.map((alg, aIdx) => (
                        <span key={aIdx} className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-bold text-[9px] font-gmarket-bold border border-orange-100">
                          {alg}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-2 bg-[#FAF7EF] rounded-xl p-3.5 z-10 border border-[#e5e2db]/50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gmarket-light text-xs font-medium text-stone-500 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-stone-500" />
                단백질 권장량 달성률
              </span>
              <span className="font-gmarket-bold text-xs font-bold text-stone-600">60%</span>
            </div>
            <div className="w-full bg-[#ebe8e0] rounded-full h-2 overflow-hidden">
              <div className="bg-[#485229] h-full rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
            </div>
          </div>
        </article>
      </section>
    </motion.div>
  );
}
