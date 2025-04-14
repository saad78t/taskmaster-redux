import { useState } from "react";

export function useValidation() {
  const [errors, setErrors] = useState({});

  const validate = ({
    taskName,
    prioritySelection,
    classification,
    taskDescription,
  }) => {
    const newErrors = {};

    if (!taskName.trim()) newErrors.taskName = "⚠️ Task name is required";
    if (!taskDescription.trim())
      newErrors.taskDescription = "⚠️ Description is required.";
    if (!prioritySelection)
      newErrors.prioritySelection = "⚠️ Please select a priority";
    if (!classification)
      newErrors.classification = "⚠️ Please select a classification";

    setErrors(newErrors);
    return newErrors;
  };

  return { errors, validate, setErrors };
}
