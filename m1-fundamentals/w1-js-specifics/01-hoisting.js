// =============================================================
// 01 — Hoisting, var/let/const, TDZ


console.log("1:", a); //undefined - лог перед объявлением переменной
var a = 10;


let b = 20;
console.log("2:", b); // 20 - лог после объявления переменной


// Задача 3. Область видимости var vs let в блоке
{
  var x = "var внутри блока";
  let y = "let внутри блока";
}
console.log("3a:", x); // доступна 
//console.log("3b:", y); // let y не доступна снаружи блока, будет ReferenceError


// Задача 4. const и мутация
const arr = [1, 2];
arr.push(3);      // можно мутировать содержимое массива
//arr = [9, 9, 9];  // нельзя переназначить саму переменную, будет TypeError
console.log("4:", arr);


// Задача 5. Hoisting объявления функции vs выражения
console.log("5a:", sum(2, 3));   // ошибки нет, так как sum объявлена как function declaration и поднимается в hoisting
//console.log("5b:", mul(2, 3));   // ошибка, так как mul объявлена как const и находится в TDZ (Temporal Dead Zone) до её объявления

function sum(p, q) {
  return p + q;
}
const mul = (p, q) => p * q;

// Чем JS-var отличается от C#-var? JS var имеет функциональную область видимости, C# var блочную
