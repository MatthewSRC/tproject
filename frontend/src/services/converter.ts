import base64 from "base64-js";

function convertBufferToBase64(buffer: ArrayBuffer) {
  return base64.fromByteArray(new Uint8Array(buffer));
}

function formatSecondsToTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function formatRelativeTime(isoDatetime: string): string {
  const now = new Date();
  const date = new Date(isoDatetime);
  const elapsedMilliseconds = now.getTime() - date.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

  const timeUnits = [
    { value: 604800, unit: "w" },
    { value: 86400, unit: "d" },
    { value: 3600, unit: "h" },
    { value: 60, unit: "m" },
    { value: 1, unit: "s" },
  ];

  for (const unit of timeUnits) {
    const unitValue = unit.value;
    if (elapsedSeconds >= unitValue) {
      const elapsed = Math.floor(elapsedSeconds / unitValue);
      return `${elapsed}${unit.unit} ago`;
    }
  }

  return "Just now";
}

export { convertBufferToBase64, formatSecondsToTime, formatRelativeTime };
