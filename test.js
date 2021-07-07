const regex = /( )*- (\w| )+\n/gi;
const string = `
## Changed

- changed 1
- changed 2

## Fixed

- fixed 1
- fixed 2
`;

let next = regex.exec(string);
while (next !== null) {
  console.log(next);
  next = regex.exec(string);
}
