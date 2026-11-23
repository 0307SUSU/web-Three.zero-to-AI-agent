const numbers = [1, 2, 3, 4];

// 1. for...of：计算所有数字之和，预期 10
let forOfSum = 0;
for (const number of numbers) {
  // 思考过程：
  // 1. 目标所有number相加，将相加的结果赋值给forOfSum
  // 2. 具体操作，forOfSum等于每一个number与当前forOfSum相加
  forOfSum = number + forOfSum
}
console.log("for...of:", forOfSum);

// 2. reduce：计算所有数字之和，预期 10
const reduceSum = numbers.reduce((num,value)=>{
  return num + value
},0);
console.log("reduce:", reduceSum);

// 3. forEach：通过副作用计算所有数字之和，预期 10
let forEachSum = 0;
numbers.forEach((val,index,arr)=>{
  forEachSum = forEachSum + val;
})
console.log("forEach:", forEachSum);

// 4. map：生成每个数字的两倍，预期 [2, 4, 6, 8]
const doubled = numbers.map((val)=> val * 2);

console.log("map:", doubled);

// 5. filter：保留偶数，预期 [2, 4]
const zeroNum = [0,2,3,6,8,9]
const evenNumbers = numbers.filter((val)=>{
  return val % 2 === 0;
});
const zero = zeroNum.filter((val)=>{
  return val % 2 === 0;
})
console.log("filter:", evenNumbers,zero); // [2,4]   [0,2,6,8]
