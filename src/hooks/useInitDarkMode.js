/**
 *  شرح ميزة حفظ الدارك مود:
التطبيق يتذكر إذا كنت تستخدم الوضع الداكن (Dark Mode) أو العادي (Light Mode).

هذا يتم من خلال تخزين اختيارك في localStorage على جهازك.

كل مرة تفتح التطبيق، يتم قراءة القيمة من localStorage وتطبيقها تلقائيًا.

لو ما كانت هناك قيمة محفوظة، يتم الاعتماد على إعدادات النظام (إذا جهازك يفضل الدارك مود).

المستخدم يقدر يغيّر الوضع، والتطبيق يحفظ اختياره حتى لو سكّر الصفحة أو أعاد التشغيل.

✅ مثال بسيط على الاستفادة:
لو مستخدم فعّل "الوضع الليلي"، وطلع من التطبيق، ورجع بعد يوم — راح يظل الوضع الليلي شغال مثل ما هو، بدون ما يحتاج يفعّله من جديد.
 */

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setDarkMode } from "../redux/tasksSlice";

// function useInitDarkMode() {
//   const dispatch = useDispatch();
//   const isDarkMode = useSelector((state) => state.operations.isDarkMode);

//   useEffect(() => {
//     // فقط إذا لم يتم تحديد قيمة بعد
//     if (isDarkMode === null) {
//       const systemPrefersDark = window.matchMedia(
//         "(prefers-color-scheme: dark)"
//       ).matches;
//       dispatch(setDarkMode(systemPrefersDark));
//     }
//   }, [dispatch, isDarkMode]);
// }

// export default useInitDarkMode;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDarkMode } from "../redux/tasksSlice";

function useInitDarkMode() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedDarkMode !== null) {
      //  استخدم التفضيل المحفوظ إذا موجود
      dispatch(setDarkMode(JSON.parse(savedDarkMode)));
    } else {
      //  ماكو تفضيل محفوظ؟ اعتمد على النظام
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(setDarkMode(systemPrefersDark));
    }
  }, [dispatch]);
}

export default useInitDarkMode;

/**
 * const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
 شنو معناه؟
window.matchMedia(...):
هاي دالة من جافاسكربت تسأل المتصفح عن إعدادات الجهاز أو النظام.

"prefers-color-scheme: dark":
هاي عبارة عن media query، معناها:
"هل المستخدم يفضل الوضع الداكن؟"

.matches:
ترجع true إذا كانت الإجابة نعم، و false إذا لا.


 */
