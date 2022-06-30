(async () => {
  let i = 0;
  setInterval(async () => {
    console.log(i++);
    if (await stopCondition()) return false;
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
