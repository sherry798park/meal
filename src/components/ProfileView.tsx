/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, ShieldAlert, Bell, HelpCircle, FileText, LogOut, ChevronRight, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProfileViewProps {
  userAllergies: string[];
  onAddAllergy: (allergen: string) => void;
  onRemoveAllergy: (allergen: string) => void;
  mealNotification: boolean;
  onToggleMealNotification: () => void;
}

export default function ProfileView({
  userAllergies,
  onAddAllergy,
  onRemoveAllergy,
  mealNotification,
  onToggleMealNotification
}: ProfileViewProps) {
  // Toggle states for settings switches
  const [allergyNotification, setAllergyNotification] = useState<boolean>(true);
  
  // Dialog state for adding a new allergen
  const [isAddingAllergen, setIsAddingAllergen] = useState<boolean>(false);
  const [newAllergen, setNewAllergen] = useState<string>("");

  const commonAllergens = ["대두", "밀", "쇠고기", "돼지고기", "난류", "우유", "땅콩", "새우", "조개류", "토마토"];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAllergen = newAllergen.trim();
    if (cleanAllergen && !userAllergies.includes(cleanAllergen)) {
      onAddAllergy(cleanAllergen);
      setNewAllergen("");
      setIsAddingAllergen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 pb-4"
    >
      {/* Dynamic profile card bento grid style */}
      <section className="bg-gradient-to-br from-[#d2ea7a] to-[#c1cc98] rounded-3xl p-card-padding shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/20 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white/80 shadow-md overflow-hidden flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1GoILy0AKQANaaWa3mHj35KwNiTBztOc07AL3HbkLksCR6SjHSNTocOzq9gMT8mxtQSeb3MlhTcKwNck75OiogGQGFiJbDpP2emMrtDXqB3GhhzeUQevichppXmC3WuAJ5xmINQzhrALx6bLgiETkI81afArAwDydLztFPmthCVl6xdm5Yq1ulHa-wMwvsf44sP0Kj_hle3Bt2IObzXWZ_WTTaSBFK6n1VXAcBLFCtR7uld8MNiYCMp9imt-X7GZ7aEIRJoB5gpdy"
                alt="Student portrait avatar of Kim"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-gmarket-bold text-lg font-bold text-[#171e00]">김학생</h2>
              <p className="font-gmarket-light text-xs text-stone-700 mt-1 font-medium">씨마스고등학교 · 2학년 3반 15번</p>
            </div>
          </div>
          <button
            onClick={() => alert("현재 학적 상태는 2026학년도 씨마스고등학교 데이터베이스 서버에 등록 완료되었습니다.")}
            className="p-2.5 bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-full text-stone-800 transition-colors active:scale-90"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Settings widgets */}
      <section className="flex flex-col gap-4">
        {/* Allergy Settings */}
        <div className="bg-white rounded-3xl p-card-padding shadow-card border border-[#e5e2db]/50 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-stone-800">
              <ShieldAlert className="w-5 h-5 text-[#ba1a1a]" />
              <h3 className="font-gmarket-bold text-[14px] font-bold text-stone-800">알레르기 경고 알림</h3>
            </div>

            {/* Custom styled iOS toggle switch */}
            <button
              onClick={() => setAllergyNotification(!allergyNotification)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                allergyNotification ? "bg-[#485229]" : "bg-stone-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  allergyNotification ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <p className="font-gmarket-light text-xs leading-relaxed text-stone-500 font-medium">
            체크된 유발식품이 포함된 식자재 요리가 급식 메뉴에 나오는 경우, 경고 아이콘 기호가 실시간 자동 점등됩니다.
          </p>

          <AnimatePresence>
            {allergyNotification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-wrap gap-2 mt-2 pt-3 border-t border-[#f1eee6]"
              >
                {userAllergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="pl-3 pr-2.5 py-1 bg-red-50 text-red-700 hover:text-red-900 border border-red-200 text-xs font-bold font-gmarket-bold rounded-full flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    {allergy}
                    <button onClick={() => onRemoveAllergy(allergy)} className="focus:outline-none p-0.5 rounded-full hover:bg-red-100 text-red-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={() => setIsAddingAllergen(true)}
                  className="bg-[#ebe8e0] hover:bg-[#ebe8e0]/90 text-[#4F6F00] font-bold text-xs font-gmarket-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors active:scale-95 duration-200"
                >
                  <Plus className="w-4 h-4 text-[#4F6F00]" />
                  지정 추가
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Modal inline for Adding Allergen */}
        <AnimatePresence>
          {isAddingAllergen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-5 border border-[#d2ea7a] shadow-card flex flex-col gap-3"
            >
              <h4 className="font-gmarket-bold text-sm text-[#4F6F00] font-bold">⚠️ 알레르기 성분 즉시 추가</h4>
              <p className="font-gmarket-light text-xs text-stone-500 font-medium">유발 식품 카테고리 중 대표 항목을 직접 입력하거나 아래 추천을 터치하세요:</p>
              
              <form onSubmit={handleAddSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="예: 돼지고기, 우유, 새우, 게"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  className="flex-1 text-xs font-gmarket-light border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#4F6F00]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#4F6F00] text-white text-xs font-gmarket-bold px-4 py-2.5 rounded-lg font-bold"
                >
                  추가
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {commonAllergens
                  .filter((a) => !userAllergies.includes(a))
                  .slice(0, 7)
                  .map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setNewAllergen(item)}
                      className="text-[10px] filter hover:bg-stone-100 px-2.5 py-1 bg-[#FAF7EF] rounded-md font-medium font-gmarket-light border border-[#e5e2db]"
                    >
                      +{item}
                    </button>
                  ))}
              </div>

              <button
                type="button"
                onClick={() => setIsAddingAllergen(false)}
                className="text-[10px] text-stone-400 font-gmarket-light text-right mt-1 w-full"
              >
                닫기
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily Meal Timing Switch */}
        <div className="bg-white rounded-3xl p-card-padding shadow-card border border-[#e5e2db]/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4F6F00]/10 text-[#4F6F00] rounded-full">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gmarket-bold text-sm font-bold text-stone-800">일일 식단 자동 알림</h3>
              <p className="font-gmarket-light text-xs text-stone-400 mt-1">매일 오전 08:00 예약발송</p>
            </div>
          </div>

          <button
            onClick={onToggleMealNotification}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              mealNotification ? "bg-[#485229]" : "bg-stone-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                mealNotification ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Link navigation settings list */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-[#e5e2db]/50">
          <button
            onClick={() => alert("씨마스고등학교 급식 고객센터 서비스팀: 02-345-6789 (운영: 09:00~17:00)")}
            className="flex justify-between items-center p-4 w-full text-left hover:bg-stone-50 transition-colors border-b border-[#f1eee6]"
          >
            <div className="flex items-center gap-3 text-stone-700">
              <HelpCircle className="w-5 h-5 text-stone-500" />
              <span className="font-gmarket-medium text-[13px] text-stone-800 font-medium">고객센터 / 문의하기</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => alert("개인정보처리방침 및 씨마스고등학교 스마트 급식 지원 플랫폼 가이드라인 기준 이용 약관입니다.")}
            className="flex justify-between items-center p-4 w-full text-left hover:bg-stone-50 transition-colors border-b border-[#f1eee6]"
          >
            <div className="flex items-center gap-3 text-stone-700">
              <FileText className="w-5 h-5 text-stone-500" />
              <span className="font-gmarket-medium text-[13px] text-stone-800 font-medium">서비스 이용 약관</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => alert("로그아웃 기능 데모 버전입니다.")}
            className="flex justify-between items-center p-4 w-full text-left hover:bg-red-50/50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-gmarket-medium text-[13px] font-medium">로그아웃 (Sign Out)</span>
            </div>
          </button>
        </div>
      </section>

      {/* Footer info containing dynamic date-aware 2026 */}
      <footer className="mt-4 text-center">
        <p className="font-gmarket-light text-[10px] text-stone-400">© 2026 씨마스고등학교 급식</p>
        <p className="font-gmarket-light text-[10px] text-stone-400 mt-1">건강하고 맛있는 학교 식단을 스마트하게 지원합니다.</p>
      </footer>
    </motion.div>
  );
}
