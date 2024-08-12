export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const rewardPointsPerTrans = (data) => {
  if (data.amount >= 100) {
    return 2 * (data.amount - 100) + 1 * 50;
  } else {
    return 0;
  }
};


