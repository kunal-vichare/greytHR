const multiply = require("./demo")

//test suite
test("2 and 5 multiply equal to 10",()=>{
    expect(multiply(2,5)).toBe(10);
})