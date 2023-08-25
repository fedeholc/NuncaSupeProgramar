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

### Instalación de Jest

```bash
npm install --save-dev jest
```

Para usar con TypeScript instalar también @types/jest:

```bash
npm install --save-dev @types/jest
```

### Correr tests

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

### Criterios para nombrar y estructurar los tests

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
Si ponemos más de una regla como acá:

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
