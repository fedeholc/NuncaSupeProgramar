---
title: Testing JavaScript con Jest
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

(tomado del libro The Art of Unit Testing de Roy Osherove y Vladimir Khorikov)

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