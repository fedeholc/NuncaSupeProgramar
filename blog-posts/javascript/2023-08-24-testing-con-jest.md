---
title: JavaScript - Testing con Jest
description: Testing JavaScript con Jest
date: 2023-08-24T20:33:13.865Z
preview: ""
draft: false
tags:
  - Testing
  - Jest
  - JavaScript
categories: [destacado]
slug: testing-con-jest
---

- [Instalación de Jest](#instalación-de-jest)
- [Correr tests](#correr-tests)
- [Criterios para nombrar y estructurar los tests](#criterios-para-nombrar-y-estructurar-los-tests)
- [Ejemplo de testear varias reglas de una clase que guarda state](#ejemplo-de-testear-varias-reglas-de-una-clase-que-guarda-state)
- [Uso de beforeEach para evitar duplicación de código](#uso-de-beforeeach-para-evitar-duplicación-de-código)
- [Uso de Factory Methods](#uso-de-factory-methods)
- [Testear variaciones de una regla con Test.each](#testear-variaciones-de-una-regla-con-testeach)
- [Testear que la función arroje un error con ThrowError](#testear-que-la-función-arroje-un-error-con-throwerror)
- [Testing con dependencias (Sutbs y Mocks)](#testing-con-dependencias-sutbs-y-mocks)
  - [Stubs](#stubs)
  - [Mocks](#mocks)

Los ejemplos de código están tomados del libro _The Art of Unit Testing_ de Roy Osherove y Vladimir Khorikov: https://github.com/royosherove/aout3-samples/tree/master

## Instalación de Jest

```bash
npm install --save-dev jest
```

Para usar con TypeScript instalar también @types/jest:

```bash
npm install --save-dev @types/jest
```

## Correr tests

**Una vez:**

```bash
npx jest
```

**En modo watch:**

```bash
npx jest --watch
```

Si no se tiene git activo, hay que usar:

```bash
npx jest --watchAll
```

## Criterios para nombrar y estructurar los tests

1. La unidad de trabajo bajo prueba (la función verifyPassword en el ejemplo)
2. El escenario o entradas a la unidad (regla fallida)
3. El comportamiento esperado o punto de salida (devuelve un error con una razón)

**Ejemplo de test**

```javascript
test("verifyPassword, given a failing rule, returns errors", () => {
  const fakeRule = (input) => ({ passed: false, reason: "fake reason" });
  const errors = verifyPassword("any value", [fakeRule]);
  expect(errors[0]).toContain("fake reason");
});
```

**Ejemplo con _describe_**
Lo hace más legible y permite estructurar otros tests dentro de la misma unidad de trabajo.

```javascript
describe("verifyPassword", () => {
  test("given a failing rule, returns errors", () => {
    const fakeRule = (input) => ({ passed: false, reason: "fake reason" });
    const errors = verifyPassword("any value", [fakeRule]);
    expect(errors[0]).toContain("fake reason");
  });
});
```

- Si se quiere se pueden anidar varios _describe_ para estructurar aún más los tests.
- En casos cómo este recomiendan usar _toContain_ o _toMatch_ en vez de _toBe_ o _toEqual_ para que no falle si se cambia levemente el mensaje de error.
- También se puede usar _it_ en vez de _test_, es lo mismo.

## Ejemplo de testear varias reglas de una clase que guarda state

**Definición de la clase**

```javascript
class PasswordVerifier1 {
  constructor() {
    this.rules = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  verify(input) {
    if (this.rules.length === 0) {
      throw new Error("There are no rules configured");
    }
    const errors = [];
    this.rules.forEach((rule) => {
      const result = rule(input);
      if (result.passed === false) {
        errors.push(result.reason);
      }
    });
    return errors;
  }
}

module.exports = { PasswordVerifier1 };
```

**Más de una regla en un solo test (¡Problemas!)**

```javascript showLineNumbers {11,12}
describe("v2 PasswordVerifier", () => {
  describe("with a failing rule", () => {
    it("has an error message based on the rule.reason", () => {
      const verifier = new PasswordVerifier1();
      const fakeRule = (input) => ({
        passed: false,
        reason: "fake reason",
      });
      verifier.addRule(fakeRule);
      const errors = verifier.verify("any value");
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain("fake reason");
    });
  });
});
```

Si ponemos más de una regla como en el ejemplo, y el test falla en la primera, la segunda nunca se va a ejecutar.

Hay que separar los tests para que cada uno tenga una sola regla. Podría quedar así:

```javascript showLineNumbers {4-8,14-18}
describe("v3 PasswordVerifier", () => {
  describe("with a failing rule", () => {
    it("has an error message based on the rule.reason", () => {
      const verifier = new PasswordVerifier1();
      const fakeRule = (input) => ({
        passed: false,
        reason: "fake reason",
      });
      verifier.addRule(fakeRule);
      const errors = verifier.verify("any value");
      expect(errors[0]).toContain("fake reason");
    });
    it("has exactly one error", () => {
      const verifier = new PasswordVerifier1();
      const fakeRule = (input) => ({
        passed: false,
        reason: "fake reason",
      });
      verifier.addRule(fakeRule);
      const errors = verifier.verify("any value");
      expect(errors.length).toBe(1);
    });
  });
});
```

El problema con eso es que estamos duplicando código.

## Uso de beforeEach para evitar duplicación de código

```javascript showLineNumbers
describe("v5 PasswordVerifier", () => {
  let verifier;
  beforeEach(() => (verifier = new PasswordVerifier1()));
  describe("with a failing rule", () => {
    let fakeRule, errors;
    beforeEach(() => {
      fakeRule = (input) => ({ passed: false, reason: "fake reason" });
      verifier.addRule(fakeRule);
      errors = verifier.verify("any value");
    });
    it("has an error message based on the rule.reason", () => {
      expect(errors[0]).toContain("fake reason");
    });
    it("has exactly one error", () => {
      expect(errors.length).toBe(1);
    });
  });
});
```

De esa forma se evita la duplicación de código, pero aparece un nuevo inconveniente que
se va a notar aún más cuando crezca la cantidad de tests: no queda a la vista dónde y cómo
se llega al error, para eso hay que ir a buscarlo en el beforeEach (lo cual produce "scroll-fatigue").

Ejemplo con muchos escenarios:

```javascript showLineNumbers
describe("v6 PasswordVerifier", () => {
  let verifier;
  beforeEach(() => (verifier = new PasswordVerifier1()));
  describe("with a failing rule", () => {
    let fakeRule, errors;
    beforeEach(() => {
      fakeRule = (input) => ({ passed: false, reason: "fake reason" });
      verifier.addRule(fakeRule);
      errors = verifier.verify("any value");
    });
    it("has an error message based on the rule.reason", () => {
      expect(errors[0]).toContain("fake reason");
    });
    it("has exactly one error", () => {
      expect(errors.length).toBe(1);
    });
  });
  describe("with a passing rule", () => {
    let fakeRule, errors;
    beforeEach(() => {
      fakeRule = (input) => ({ passed: true, reason: "" });
      verifier.addRule(fakeRule);
      errors = verifier.verify("any value");
    });
    it("has no errors", () => {
      expect(errors.length).toBe(0);
    });
  });
  describe("with a failing and a passing rule", () => {
    let fakeRulePass, fakeRuleFail, errors;
    beforeEach(() => {
      fakeRulePass = (input) => ({ passed: true, reason: "fake success" });
      fakeRuleFail = (input) => ({ passed: false, reason: "fake reason" });
      verifier.addRule(fakeRulePass);
      verifier.addRule(fakeRuleFail);
      errors = verifier.verify("any value");
    });
    it("has one error", () => {
      expect(errors.length).toBe(1);
    });
    it("error text belongs to failed rule", () => {
      expect(errors[0]).toContain("fake reason");
    });
  });
});
```

Ahora además de la scroll-fatigue aparece la duplicación de código en los beforeEach.
Frente a eso una posibilidad es usar "factory methods" para reutilizar la lógica y reducir duplicación.

## Uso de Factory Methods

Se pueden usar en combinación con beforeEach, creando funciones para las reglas que pasan y las que no.
Pero también se pueden usar directamente para reemplazar los beforeEach.

```javascript showLineNumbers
const makeVerifier = () => new PasswordVerifier1();
const passingRule = (input) => ({ passed: true, reason: "" });

const makeVerifierWithPassingRule = () => {
  const verifier = makeVerifier();
  verifier.addRule(passingRule);
  return verifier;
};

const makeVerifierWithFailedRule = (reason) => {
  const verifier = makeVerifier();
  const fakeRule = (input) => ({ passed: false, reason: reason });
  verifier.addRule(fakeRule);
  return verifier;
};

describe("v8 PasswordVerifier", () => {
  describe("with a failing rule", () => {
    it("has an error message based on the rule.reason", () => {
      const verifier = makeVerifierWithFailedRule("fake reason");
      const errors = verifier.verify("any input");
      expect(errors[0]).toContain("fake reason");
    });
    it("has exactly one error", () => {
      const verifier = makeVerifierWithFailedRule("fake reason");
      const errors = verifier.verify("any input");
      expect(errors.length).toBe(1);
    });
  });
  describe("with a passing rule", () => {
    it("has no errors", () => {
      const verifier = makeVerifierWithPassingRule();
      const errors = verifier.verify("any input");
      expect(errors.length).toBe(0);
    });
  });
  describe("with a failing and a passing rule", () => {
    it("has one error", () => {
      const verifier = makeVerifierWithFailedRule("fake reason");
      verifier.addRule(passingRule);
      const errors = verifier.verify("any input");
      expect(errors.length).toBe(1);
    });
    it("error text belongs to failed rule", () => {
      const verifier = makeVerifierWithFailedRule("fake reason");
      verifier.addRule(passingRule);
      const errors = verifier.verify("any input");
      expect(errors[0]).toContain("fake reason");
    });
  });
});
```

Si se prefiere también se pueden eliminar los describe, y dejarlo así:

```javascript showLineNumbers
// v9 tests
test(
  "pass verifier, with failed rule, " +
    "has an error message based on the rule.reason",
  () => {
    const verifier = makeVerifierWithFailedRule("fake reason");
    const errors = verifier.verify("any input");
    expect(errors[0]).toContain("fake reason");
  }
);
test("pass verifier, with failed rule, has exactly one error", () => {
  const verifier = makeVerifierWithFailedRule("fake reason");
  const errors = verifier.verify("any input");
  expect(errors.length).toBe(1);
});
test("pass verifier, with passing rule, has no errors", () => {
  const verifier = makeVerifierWithPassingRule();
  const errors = verifier.verify("any input");
  expect(errors.length).toBe(0);
});
test(
  "pass verifier, with passing  and failing rule," + " has one error",
  () => {
    const verifier = makeVerifierWithFailedRule("fake reason");
    verifier.addRule(passingRule);
    const errors = verifier.verify("any input");
    expect(errors.length).toBe(1);
  }
);
test(
  "pass verifier, with passing  and failing rule," +
    " error text belongs to failed rule",
  () => {
    const verifier = makeVerifierWithFailedRule("fake reason");
    verifier.addRule(passingRule);
    const errors = verifier.verify("any input");
    expect(errors[0]).toContain("fake reason");
  }
);

test("verify, with no rules, throws exception", () => {
  const verifier = makeVerifier();
  try {
    verifier.verify("any input");
    fail("error was expected but not thrown");
  } catch (e) {
    expect(e.message).toContain("no rules configured");
  }
});

test("verify, with no rules, throws exception", () => {
  const verifier = makeVerifier();
  expect(() => verifier.verify("any input")).toThrowError(
    /no rules configured/
  );
});
```

## Testear variaciones de una regla con Test.each

La regla:

```javascript
const oneUpperCaseRule = (input) => {
  return {
    passed: input.toLowerCase() !== input,
    reason: "at least one upper case needed",
  };
};

module.exports = {
  oneUpperCaseRule,
};
```

Tests:

```javascript showLineNumbers
const { oneUpperCaseRule } = require("../password-rules");

describe("v2 one uppercase rule", () => {
  test("given no uppercase, it fails", () => {
    const result = oneUpperCaseRule("abc");
    expect(result.passed).toEqual(false);
  });

  test.each(["Abc", "aBc"])("given one uppercase, it passes", (input) => {
    const result = oneUpperCaseRule(input);
    expect(result.passed).toEqual(true);
  });
});
```

También, como en el siguiente ejemplo, se podría hacer sin test.each, usando JavaScript. Además se agrega el caso en el que no pasa la regla, pero no es bueno porque estamos testeando dos cosas distintas en el mismo lugar.

```javascript showLineNumbers
describe("v5 one uppercase rule, with vanilla JS test.each", () => {
  const tests = {
    Abc: true,
    aBc: true,
    abc: false,
  };

  for (const [input, expected] of Object.entries(tests)) {
    test(`given ${input}, ${expected}`, () => {
      const result = oneUpperCaseRule(input);
      expect(result.passed).toEqual(expected);
    });
  }
});
```

## Testear que la función arroje un error con ThrowError

Si nuestra función fuera así:

```javascript {9-11} showLineNumbers
class PasswordVerifier1 {
  constructor() {
    this.rules = [];
  }
  addRule(rule) {
    this.rules.push(rule);
  }
  verify(input) {
    if (this.rules.length === 0) {
      throw new Error("There are no rules configured");
    }
    const errors = [];
    this.rules.forEach((rule) => {
      const result = rule(input);
      if (result.passed === false) {
        errors.push(result.reason);
      }
    });
    return errors;
  }
}

module.exports = { PasswordVerifier1 };
```

Nuestro test podría ser así:

```javascript showLineNumbers
test("verify, with no rules, throws exception", () => {
  const verifier = makeVerifier();
  expect(() => verifier.verify("any input")).toThrowError(
    /no rules configured/
  );
});
```

## Testing con dependencias (Sutbs y Mocks)

Cuando lo que queremos testear tiene dependencias en la entrada (incoming dependencies) se utilizan **Stubs**. Cuando tiene dependencias en la salida (outgoing dependencies) se utilizan **Mocks**.

Cada unidad a testear puede tener tres tipos diferentes de puntos de salida: devolución de un valor, cambio de estado, o una llamada a una función externa. Para los dos primeros casos se usan Stubs, solo para el tercero es necesario un Mock.

### Stubs

Si tuviéramos una función que utiliza internamente la librería moments para obtener el día de la semana y operar según el mismo, sería un problema para testear porque no está bajo nuestro control (también podrían ser otras situaciones en las que se depende de datos externos, como una base de datos, un servicio, etc.).
En esos casos lo que hay que hacer es mover fuera de la función esa llamada. Eso se puede hacer de distintas maneras, como puede ser pasar el dato como parámetro, o crear una función que devuelva el dato (dependency injection). El libro explica como hacerlo con un diseño funcional y también en uno orientado a objetos. Luego a la hora de hacer el test se simula (eso es el stub) el parámetro o la función que devuelve el dato, para que devuelva lo que nosotros queremos para el test.

### Mocks

Las pruebas de interacción consisten en comprobar cómo una unidad de trabajo interactúa y envía mensajes (es decir, llama a funciones) a una dependencia fuera de su control. Las funciones u objetos Mock se utilizan para comprobar que una llamada se ha realizado correctamente a una dependencia externa.
