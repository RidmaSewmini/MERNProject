// util.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Handle invalid date input
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",   // Jan, Feb, Mar...
    day: "numeric",
    hour: "2-digit",  // 01, 02...
    minute: "2-digit",
    hour12: true,     // 12-hour format with AM/PM
  });
};
