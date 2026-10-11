import{test}from'node:test';import assert from'node:assert/strict';import{calculate}from'../js/apps/calculator.js';
test('precedence, decimals, unary signs, parentheses and percentage',()=>{for(const[input,expected]of[['2+3*4',14],['(2+3)*4',20],['-2*-3',6],['0.1+0.2',.3],['200*10%',20],['-(4+3)',-7],['1/4',.25],['.5+.25',.75]])assert.equal(calculate(input),expected)});
test('rejects malformed input, zero division and executable text',()=>{for(const input of ['','2/0','(1+2','2+','alert(1)','1;2','1..2','2**4','NaN']){assert.throws(()=>calculate(input),input)}});
