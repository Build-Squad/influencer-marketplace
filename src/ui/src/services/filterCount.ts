// A function that will take a object and return a number

/*
Example:
Input: {
  order_by: 'created_at',
  objects: {}
  influencers: [
    "", "", ""
  ],
  lt_rating: ""
}
Output: 4 (3 influencers + 1 order_by)

This function will count the number of keys in the object and return the count
It will ignore the keys that have empty array or empty string as value and will ignore some defined keys
Additional keys can be added to the ignore list from a parameter
For the keys that are arrays, it will count the number of elements in the array
*/

const defaultIgnoreList = ["objects", "order_by", "search", "status"];

const filterCount = (
  filter: any,
  ignoreList: string[] = defaultIgnoreList
): number => {
  let count = 0;
  for (const key in filter) {
    if (ignoreList.includes(key)) {
      continue;
    }
    if (filter[key] === "" || filter[key] === undefined) {
      continue;
    }
    if (Array.isArray(filter[key])) {
      count += filter[key].length;
    } else {
      count += 1;
    }
  }
  return count;
};

export default filterCount;
