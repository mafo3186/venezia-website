export const generateRandomAnagram = (string: string) => {
  return string.split('').sort(() => Math.random() - 0.5).join('');
};
