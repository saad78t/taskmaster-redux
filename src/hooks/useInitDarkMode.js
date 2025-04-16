import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../redux/tasksSlice";

function useInitDarkMode() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.operations.isDarkMode);

  useEffect(() => {
    // فقط إذا لم يتم تحديد قيمة بعد
    if (isDarkMode === null) {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(setDarkMode(systemPrefersDark));
    }
  }, [dispatch, isDarkMode]);
}

export default useInitDarkMode;
