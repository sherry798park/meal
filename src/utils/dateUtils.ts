/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns a Date object representing the current moment in Korea (KST, UTC+9).
 * Set to 12:00:00 to avoid conversion and shifting anomalies when doing formatting.
 */
export function getTodayKST(): Date {
  const now = new Date();
  
  // Format current UTC time according to KST
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  });
  
  const formattedString = formatter.format(now); // e.g. "5/21/2026, 20:05:14"
  // Let's parse the fields securely
  const parts = formattedString.match(/(\d+)\/(\d+)\/(\d+)/);
  if (parts) {
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[3], 10);
    return new Date(year, month - 1, day, 12, 0, 0);
  }
  
  // Fallback
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

/**
 * Formats a Date object into "M월 D일 요일" (e.g. "5월 15일 금요일").
 */
export function formatKoreanDate(date: Date): string {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayName = days[date.getDay()];
  return `${m}월 ${d}일 ${dayName}`;
}

/**
 * Formats a Date object into "YYYYMMDD" format.
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * Retreives KST string representation like "YYYY-MM-DD".
 */
export function formatKSTString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns Monday to Friday Date objects of the week of the given date.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
  // Find Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const target = new Date(monday);
    target.setDate(monday.getDate() + i);
    weekDates.push(target);
  }
  return weekDates;
}

/**
 * Computes how many weeks are elapsed in the current month for the date (e.g. "5월 3주차").
 */
export function getWeekOfMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  // First day of that month
  const firstDay = new Date(year, date.getMonth(), 1, 12, 0, 0);
  const firstDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday ...
  
  // Calculate index adjusted where Monday is 0 and Sunday is 6
  const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const dayNum = date.getDate();
  
  const weekNum = Math.ceil((dayNum + adjustedFirstDayOfWeek) / 7);
  return `${month}월 ${weekNum}주차`;
}

/**
 * Returns the default selected date:
 * - If today is Monday to Friday, returns today
 * - If today is Saturday or Sunday, returns next Monday (Style B recommendation)
 */
export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay();
  if (day === 0) { // Sunday -> Next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + 1);
    return nextMonday;
  } else if (day === 6) { // Saturday -> Next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + 2);
    return nextMonday;
  }
  return today;
}

/**
 * Returns the short day of the week label (e.g., "월", "화" etc.).
 */
export function getKoreanDayOfWeekShort(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}
