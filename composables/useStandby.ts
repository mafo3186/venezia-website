export const usestandBy = () => {
  const isInStandBy = useState("isInStandBy", () => false);
  const standByTime = 600000; // 10 min

  const standByInterval = useState("standByInterval", (): any => undefined);
  function startStandBy() {
    clearInterval(standByInterval.value);
    isInStandBy.value = true;
  }

  function resetStandByTimer() {
    if (!isInStandBy.value) {
      clearInterval(standByInterval.value);
      standByInterval.value = setInterval(startStandBy, standByTime);
    }
    isInStandBy.value = false;
  }

  return {
    isInStandBy,
    resetStandByTimer,
  };
};
