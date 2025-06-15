export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateSignUpForm = (
  email: string,
  password: string,
  confirmPassword: string,
  displayName: string
) => {
  if (!email?.trim() || !password || !confirmPassword || !displayName?.trim()) {
    return {
      isValid: false,
      error: {
        title: "Missing Information",
        description: "Please fill in all required fields"
      }
    };
  }

  if (!validatePassword(password)) {
    return {
      isValid: false,
      error: {
        title: "Password Too Short",
        description: "Password must be at least 6 characters long"
      }
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: {
        title: "Password Mismatch",
        description: "Passwords do not match"
      }
    };
  }

  if (!validateEmail(email)) {
    return {
      isValid: false,
      error: {
        title: "Invalid Email",
        description: "Please enter a valid email address"
      }
    };
  }

  return { isValid: true };
};

export const validateSignInForm = (email: string, password: string) => {
  if (!email || !password) {
    return {
      isValid: false,
      error: {
        title: "Missing Information",
        description: "Please enter both email and password"
      }
    };
  }

  return { isValid: true };
};