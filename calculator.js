const express = require("express");
const app = express();

app.get("/:operation(mean|median|mode)", (req, res) => {
  const operation = req.params.operation;
  const nums = req.query.nums;

  if (!nums) {
    return res.status(400).send("Query parameter 'nums' is required.");
  }

  const numsArray = nums
    .split(",")
    .map(Number)
    .sort((a, b) => a - b);

  if (numsArray.some(isNaN)) {
    return res.status(400).send("All elements in 'nums' must be valid numbers");
  }

  let result;
  switch (operation) {
    case "mean":
      result = numsArray.reduce((acc, num) => acc + num, 0) / numsArray.length;
      break;

    case "median":
      numsArray.sort();
      const mid = Math.floor(numsArray.length / 2);
      result =
        numsArray.length % 2 !== 0
          ? numsArray[mid]
          : (numsArray[mid - 1] + numsArray[mid]) / 2;
      break;

    case "mode":
      const freq = {};
      numsArray.forEach((num) => (freq[num] = (freq[num] || 0) + 1));
      const maxFreq = Math.max(...Object.values(freq));
      result = Object.keys(freq)
        .filter((key) => freq[key] === maxFreq)
        .map(Number);
      result = result.length === 1 ? result[0] : result;
      break;

    default:
      return res.status(400).send({ error: "Invalid operantion." });
  }

  res.json({ response: { operation, value: result } });
});

app.listen(3000, () => {
  console.log("localHost:3000 is ready to connect");
});
