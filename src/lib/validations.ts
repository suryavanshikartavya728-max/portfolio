export const rollNumberRegex = /^([BDMTS]|IM)(22|23|24|25)([0-5]\d{2}|600)$/i;

export const validateRollNumber = (roll: string) => {
  return rollNumberRegex.test(roll);
};

export const validatePassword = (password: string) => {
  return password.length >= 8;
};

export const validateFullName = (name: string) => {
  return name.trim().length >= 3;
};
