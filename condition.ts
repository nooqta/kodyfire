(async () => {
  let i = 0;
  setInterval(() => {
    console.log(i++);
    if (stopCondition) return false;
    return true;
  }, 1000);
})();

const stopCondition = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};
