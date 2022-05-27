function pick(source, keys) {
  return keys.reduce((result, key) => {
    if (source && source.hasOwnProperty(key)) result[key] = source[key];
    return result;
  }, {});
}

module.exports = pick;
