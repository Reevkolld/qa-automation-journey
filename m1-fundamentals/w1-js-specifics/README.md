# W1 — JS specifics for a C# developer

Public log entry for Week 1 (29.06–05.07.2026) of my Manual → Automation QA transition.
Full write-up (theory, C#-comparisons, interview questions): [Vault conspect](../../../../03%20Theory) — _"JS для C-sharp: var/let/const, hoisting, equality, this, closures"_.

## Files

| File                                         | Topic                              | What it covers                                                                                                                                  |
| -------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-hoisting.js`](./01-hoisting.js)         | `var`/`let`/`const`, hoisting, TDZ | `var` hoists as `undefined`; `let`/`const` hoist into the Temporal Dead Zone; function scope vs block scope; `const` mutability vs reassignment |
| [`02-coercion.js`](./02-coercion.js)         | Type coercion, `==` vs `===`       | Truthy/falsy, implicit type conversion, why `==` hides bugs in assertions                                                                       |
| [`03-this-binding.js`](./03-this-binding.js) | `this` — 4 binding rules           | Default, implicit (object method), explicit (`bind`/`call`/`apply`), and lexical (arrow function) binding                                       |
| [`04-closures.js`](./04-closures.js)         | Closures                           | `var` vs `let` in loops with `setTimeout`, counter/private-state patterns, C# delegate analogy                                                  |

## Why this matters for QA automation

`var` in a loop with async callbacks is the exact bug shape you hit when generating Playwright tests in a loop. Loose `==` in an assertion can silently swallow a type bug (`"0" == 0` → `true`). Arrow functions preserving `this` is why Playwright test callbacks don't lose context. All four topics are prerequisites for Week 2 (Promises/async-await) and the Playwright module (M2).

## Running

Plain Node, no dependencies:

```bash
node m1-fundamentals/w1-js-specifics/01-hoisting.js
```
