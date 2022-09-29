const pipe = (...functions) => (val) => functions.reduce((acc, fn) => fn(acc), val);
export default pipe;