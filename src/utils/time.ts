export const MINUTE_IN_SECONDS = 60;

export const convertSecondsToTime = (secs: number) => {
  const minutes = Math.floor(secs / MINUTE_IN_SECONDS);
  const seconds = secs - minutes * MINUTE_IN_SECONDS;

  return { minutes, seconds };
};

export const convertTimeToString = ({
  minutes,
  seconds
}: {
  minutes: number;
  seconds: number;
}) => {
  return `${minutes ? minutes + "m" : ""} ${seconds || 0}s`;
};
