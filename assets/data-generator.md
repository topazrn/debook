# Data generator template
```js
JG.repeat(10, 15, {
  name: JG.firstName() + " " + JG.lastName(),
  email: (JG.firstName() + "." + JG.lastName() + "@gmail.com").toLowerCase(),
  phone: '08'+ JG.integer(100000000, 9999999999),
  debts: JG.repeat(1, 6, {
    amount: JG.integer(-5000000, 5000000),
    description: (JG.loremIpsum({units: 'words', count: JG.integer(1, 3)}).split(" ").map(str => str.charAt(0).toUpperCase() + str.slice(1))).join(" "),
    date: moment(JG.date(new Date(2014, 0, 1), new Date())).format("YYYY-MM-DD")
  })
});

```
Use it here https://app.json-generator.com/