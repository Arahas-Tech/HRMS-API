module.exports.addTimes = (startTime, endTime) => {
  let times = [0, 0];
  let max = times.length;

  let a = (startTime || "")?.split(":");
  let b = (endTime || "")?.split(":");

  // normalize time values
  for (let i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (let j = 0; j < max; j++) {
    times[j] = a[j] + b[j];
  }

  let hours = times[0];
  let minutes = times[1];

  if (minutes >= 60) {
    let h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return Number("0" + hours) + ":" + ("0" + minutes).slice(-2);
};
