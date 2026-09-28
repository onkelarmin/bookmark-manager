import { Dispatch, SetStateAction } from "react";

export function clearError<Errors>(
  errors: Errors,
  setErrors: Dispatch<SetStateAction<Errors>>,
  toBeDeleted: keyof Errors,
) {
  if (errors[toBeDeleted] == null) return;

  setErrors((currentErrors) => {
    const nextErrors = { ...currentErrors };
    delete nextErrors[toBeDeleted];
    return nextErrors;
  });
}
