const toJST = (date) => {
  return new Date(date)
    .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    .replace(/\//g, '-');
};

const formatWithISOString = (date) => {
  return new Date(date).toISOString();
};

const calcUntilLimit = (date) => {
  const now = new Date();
  const limit = new Date(date);
  const diff = limit - now;
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${day}日と${hour}時間${minute}分`;
};

export { calcUntilLimit, formatWithISOString, toJST };
