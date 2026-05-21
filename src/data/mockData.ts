/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Meal, DishItem } from "../types";
import { getWeekDates, formatDateKey, formatKoreanDate, formatKSTString } from "../utils/dateUtils";

// Detailed dish items mapping to let nutrition calculator compute metrics dynamically.
export const DISH_DETAILS: { [dishName: string]: DishItem } = {
  // Monday Lunch
  "친환경 혼합잡곡밥": { name: "친환경 혼합잡곡밥", kcal: 310, category: "밥류" },
  "한우 미역국": { name: "한우 미역국", kcal: 120, category: "국/찌개" },
  "수제 돈까스 & 특제소스": { name: "수제 돈까스 & 특제소스", kcal: 350, category: "반찬" },
  "시금치 나물무침": { name: "시금치 나물무침", kcal: 45, category: "반찬" },
  "배추김치": { name: "배추김치", kcal: 25, category: "반찬" },
  // Monday Dinner
  "오므라이스": { name: "오므라이스", kcal: 490, category: "밥류" },
  "가쓰오 장국": { name: "가쓰오 장국", kcal: 60, category: "국/찌개" },
  "수제 소시지 볶음": { name: "수제 소시지 볶음", kcal: 145, category: "반찬" },
  "깍두기": { name: "깍두기", kcal: 25, category: "반찬" },
  "바나나": { name: "바나나", kcal: 100, category: "디저트" },

  // Tuesday Lunch
  "낙지 비빔밥": { name: "낙지 비빔밥", kcal: 450, category: "밥류" },
  "맑은 콩나물국": { name: "맑은 콩나물국", kcal: 50, category: "국/찌개" },
  "떡갈비 구이": { name: "떡갈비 구이", kcal: 240, category: "반찬" },
  "연두부 & 양념장": { name: "연두부 & 양념장", kcal: 70, category: "반찬" },
  "백김치": { name: "백김치", kcal: 20, category: "반찬" },
  // Tuesday Dinner
  "미니 공기밥": { name: "미니 공기밥", kcal: 150, category: "밥류" },
  "마라탕": { name: "마라탕", kcal: 480, category: "국/찌개" },
  "꿔바로우 튀김": { name: "꿔바로우 튀김", kcal: 220, category: "반찬" },
  "짜사이 무침": { name: "짜사이 무침", kcal: 40, category: "반찬" },
  "빙홍차": { name: "빙홍차", kcal: 120, category: "디저트" },

  // Wednesday Lunch
  "전통 비빔밥": { name: "전통 비빔밥", kcal: 420, category: "밥류" },
  "달걀 후라이": { name: "달걀 후라이", kcal: 80, category: "반찬" },
  "약고추장": { name: "약고추장", kcal: 35, category: "반찬" },
  "팽이버섯 된장국": { name: "팽이버섯 된장국", kcal: 80, category: "국/찌개" },
  "새우튀김": { name: "새우튀김", kcal: 150, category: "반찬" },
  "요구르트": { name: "요구르트", kcal: 65, category: "디저트" },
  // Wednesday Dinner
  "친환경 흑미밥": { name: "친환경 흑미밥", kcal: 320, category: "밥류" },
  "순두부 찌개": { name: "순두부 찌개", kcal: 150, category: "국/찌개" },
  "마라 닭갈비": { name: "마라 닭갈비", kcal: 240, category: "반찬" },
  "숙주나물": { name: "숙주나물", kcal: 50, category: "반찬" },
  // "깍두기" and "바나나" already defined

  // Thursday Lunch (Cheese pork cutlet default meal!)
  "친환경현미밥": { name: "친환경현미밥", kcal: 320, category: "밥류" },
  "쇠고기미역국": { name: "쇠고기미역국", kcal: 150, category: "국/찌개" },
  "치즈돈까스": { name: "치즈돈까스", kcal: 380, category: "반찬" }, // Added to support standard selection lists elegantly
  "매콤돈육강정": { name: "매콤돈육강정", kcal: 280, category: "반찬" },
  "참깨드레싱샐러드": { name: "참깨드레싱샐러드", kcal: 95, category: "반찬" },
  // "배추김치" already defined
  // Thursday Dinner
  "참치마요덮밥": { name: "참치마요덮밥", kcal: 410, category: "밥류" },
  "유부장국": { name: "유부장국", kcal: 55, category: "국/찌개" },
  "매콤떡볶이": { name: "매콤떡볶이", kcal: 180, category: "반찬" },
  "단무지": { name: "단무지", kcal: 35, category: "반찬" },
  "쿨피스": { name: "쿨피스", kcal: 90, category: "디저트" },

  // Friday Lunch
  "하이라이스 밥": { name: "하이라이스 밥", kcal: 430, category: "밥류" },
  "가쓰오 미소시루": { name: "가쓰오 미소시루", kcal: 70, category: "국/찌개" },
  "함박스테이크 & 반숙란": { name: "함박스테이크 & 반숙란", kcal: 260, category: "반찬" },
  "콘샐러드": { name: "콘샐러드", kcal: 60, category: "반찬" },
  "단원 감귤무침": { name: "단원 감귤무침", kcal: 45, category: "디저트" },
  // Friday Dinner
  "유니 짜장면": { name: "유니 짜장면", kcal: 510, category: "밥류" },
  "계란 파국": { name: "계란 파국", kcal: 65, category: "국/찌개" },
  "찹쌀 탕수육": { name: "찹쌀 탕수육", kcal: 280, category: "반찬" },
  // "단무지" already defined
  "감귤쥬스": { name: "감귤쥬스", kcal: 90, category: "디저트" }
};

/**
 * Returns dynamic mock records mapping Monday-Friday of the week containing pivotDate.
 */
export function generateWeeklyMeals(pivotDate: Date): { [dateKey: string]: { lunch: Meal; dinner: Meal } } {
  const weekDates = getWeekDates(pivotDate);
  const result: { [dateKey: string]: { lunch: Meal; dinner: Meal } } = {};

  const daysData = [
    {
      // Monday
      lunch: {
        title: "치즈돈까스 정식", // Let's make Monday has 치즈돈까스 정식 so Monday contains a delicious choice, or we put 치즈돈까스 on Thursday
        dishes: ["친환경 혼합잡곡밥", "한우 미역국", "수제 돈까스 & 특제소스", "시금치 나물무침", "배추김치"],
        totalCalories: 850,
        nutrition: { kcal: 850, protein: 32, carbohydrates: 110, fat: 25 },
        allergens: ["소고기", "돼지고기", "밀", "대두"],
        description: "바삭하고 얇은 튀김옷 속에 부드럽고 쫄깃한 수제 한돈 돈까스와 특제 양조 소스가 어우러지는 특식입니다. 칼슘이 풍부하여 성장에 활기를 가져다줍니다."
      },
      dinner: {
        title: "소시지 오므라이스",
        dishes: ["오므라이스", "가쓰오 장국", "수제 소시지 볶음", "깍두기", "바나나"],
        totalCalories: 720,
        nutrition: { kcal: 720, protein: 18, carbohydrates: 95, fat: 20 },
        allergens: ["난류", "대두", "밀", "돼지고기"]
      }
    },
    {
      // Tuesday
      lunch: {
        title: "매콤 소고기 낙지덮밥",
        dishes: ["낙지 비빔밥", "맑은 콩나물국", "떡갈비 구이", "연두부 & 양념장", "백김치"],
        totalCalories: 810,
        nutrition: { kcal: 810, protein: 28, carbohydrates: 115, fat: 18 },
        allergens: ["대두", "밀", "쇠고기", "조개류"],
        description: "기력 보충에 탁월한 타우린이 가득한 낙지와 쫄깃한 소고기를 비벼 먹는 보양 한 끼 식단입니다. 아이들이 좋아하는 고소한 떡갈비를 사이드로 더했습니다."
      },
      dinner: {
        title: "마라탕 면 정식",
        dishes: ["미니 공기밥", "마라탕", "꿔바로우 튀김", "짜사이 무침", "빙홍차"],
        totalCalories: 890,
        nutrition: { kcal: 890, protein: 30, carbohydrates: 120, fat: 32 },
        allergens: ["대두", "밀", "돼지고기", "땅콩"]
      }
    },
    {
      // Wednesday
      lunch: {
        title: "전통 비빔밥 & 계란후라이",
        dishes: ["전통 비빔밥", "달걀 후라이", "약고추장", "팽이버섯 된장국", "새우튀김", "요구르트"],
        totalCalories: 790,
        nutrition: { kcal: 790, protein: 25, carbohydrates: 105, fat: 15 },
        allergens: ["난류", "대두", "밀", "새우", "우유"],
        description: "알록달록 다채로운 신선 나물들과 고소한 들기름, 달콤 매콤한 소고기 볶음 고추장의 조화가 예술인 비빔밥입니다. 바삭한 새우튀김이 함께 나옵니다."
      },
      dinner: {
        title: "매콤 떡볶이와 닭갈비 정식",
        dishes: ["친환경 흑미밥", "순두부 찌개", "마라 닭갈비", "숙주나물", "깍두기"],
        totalCalories: 760,
        nutrition: { kcal: 760, protein: 29, carbohydrates: 90, fat: 22 },
        allergens: ["대두", "밀", "닭고기"]
      }
    },
    {
      // Thursday (Featured/Hero of Today!)
      lunch: {
        title: "수제 치즈돈까스 정식",
        dishes: ["친환경현미밥", "쇠고기미역국", "매콤돈육강정", "참깨드레싱샐러드", "배추김치"],
        totalCalories: 845,
        nutrition: { kcal: 845, protein: 32, carbohydrates: 110, fat: 25 },
        allergens: ["대두", "밀", "쇠고기", "돼지고기"],
        description: "바삭한 튀김옷 속에 고소한 모짜렐라 치즈가 듬뿍 들어간 수제 치즈돈까스입니다. 상큼한 레몬을 곁들인 샐러드와 진한 쇠고기 미역국이 함께 제공됩니다.",
        featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL69e-ubBhPPvOEBllyYil1JdLP2dJdToJxkese9y9DiWxWMPMkoT4-pwmmbwlLMMXnjVBG6R3fIgQFTsTvLypujSXvUVlkE--CQyKT8BERLrW5ktmYaInjgyUZnaRSAE5scvfYpoNxNyJySFMnfZ2iNLuWmTn-uJqJ2QCFiXloQoS2q2PguKO1OKGMxUBpokq4Wx3LjERsjg1FsKI01qFtPcA_6XYRvhUw72bLyuTfiC53lacZ3zwGGCNX19u4Na2orzOHzHrTqHD"
      },
      dinner: {
        title: "참치마요덮밥 & 떡볶이",
        dishes: ["참치마요덮밥", "유부장국", "매콤떡볶이", "단무지", "쿨피스"],
        totalCalories: 680,
        nutrition: { kcal: 680, protein: 20, carbohydrates: 102, fat: 18 },
        allergens: ["난류", "우유", "대두", "밀"]
      }
    },
    {
      // Friday
      lunch: {
        title: "수제 함박스테이크 정식",
        dishes: ["하이라이스 밥", "가쓰오 미소시루", "함박스테이크 & 반숙란", "콘샐러드", "단원 감귤무침"],
        totalCalories: 820,
        nutrition: { kcal: 820, protein: 26, carbohydrates: 108, fat: 22 },
        allergens: ["난류", "대두", "밀", "토마토"],
        description: "셰프의 특제 브라운 데미글라스를 얹은 두톰하고 맑은 수제 돼지고기 함박스테이크와 촉촉하게 곁들이는 에그 후라이가 영양을 배로 더해 줍니다."
      },
      dinner: {
        title: "유니 짜장면 & 찹쌀탕수육",
        dishes: ["유니 짜장면", "계란 파국", "찹쌀 탕수육", "단무지", "감귤쥬스"],
        totalCalories: 880,
        nutrition: { kcal: 880, protein: 24, carbohydrates: 124, fat: 28 },
        allergens: ["난류", "대두", "밀", "돼지고기"]
      }
    }
  ];

  weekDates.forEach((date, index) => {
    const key = formatDateKey(date);
    const dayName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][date.getDay()];
    const dynamicData = daysData[index] || daysData[3]; // Fallback to Thursday if somehow out of bounds

    // Allocate details to meals for the days
    const lunchMeal: Meal = {
      id: `${key}_lunch`,
      schoolName: "씨마스고등학교",
      dateStr: formatKSTString(date),
      dateKey: key,
      dayOfWeek: dayName,
      mealType: "lunch",
      title: dynamicData.lunch.title,
      dishes: dynamicData.lunch.dishes,
      dishItems: dynamicData.lunch.dishes.map(name => DISH_DETAILS[name] || { name, kcal: 50, category: "반찬" }),
      totalCalories: dynamicData.lunch.totalCalories,
      nutrition: dynamicData.lunch.nutrition,
      allergens: dynamicData.lunch.allergens,
      featuredImage: dynamicData.lunch.featuredImage || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
      description: dynamicData.lunch.description
    };

    const dinnerMeal: Meal = {
      id: `${key}_dinner`,
      schoolName: "씨마스고등학교",
      dateStr: formatKSTString(date),
      dateKey: key,
      dayOfWeek: dayName,
      mealType: "dinner",
      title: dynamicData.dinner.title,
      dishes: dynamicData.dinner.dishes,
      dishItems: dynamicData.dinner.dishes.map(name => DISH_DETAILS[name] || { name, kcal: 45, category: "반찬" }),
      totalCalories: dynamicData.dinner.totalCalories,
      nutrition: dynamicData.dinner.nutrition,
      allergens: dynamicData.dinner.allergens,
      featuredImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
    };

    result[key] = {
      lunch: lunchMeal,
      dinner: dinnerMeal
    };
  });

  return result;
}
