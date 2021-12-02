export function addToMap(searchMap, key, value) {
  if (searchMap[key[0]] && searchMap[key[0]][key]) {
    searchMap[key[0]][key].push(value);
  } else if (!searchMap[key[0]]) {
    searchMap[key[0]] = { [key]: [value] };
  } else {
    searchMap[key[0]][key] = [value];
  }
}

export function search(searchMap, val) {
  let students = [];
  let value = val.toLowerCase();

  let searchList;
  if (searchMap[value[0]]) {
    searchList = searchMap[value[0]];
  } else {
    return new Set(students);
  }

  if(searchList[value]) {
    return new Set(searchList[value]);
  }

  Object.keys(searchList).forEach(k => {
    if (k.slice(0, value.length) === value) {
      students = students.concat(searchMap[k[0]][k]);
    }
  });
  return new Set(students);
};
