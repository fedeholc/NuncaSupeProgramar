---
title: React - CSS Modules como props de estilo para un componente
description: React - CSS Modules como props de estilo para un componente
date: 2025-01-26T10:53:44.500Z
preview: ""
draft: false
tags:
  - CSS
  - CSS Modules
  - JavaScript
  - React
categories: []
slug: react-css-modules-como-props-de-estilo-para-componente
---

El problema a resolver es el siguiente. Supongamos que creamos un componente, en este caso `SelectableList`, que recibe un array de elementos y permite seleccionar uno o varios elementos de la lista. Este componente tiene un estilo por defecto, pero queremos que el usuario pueda pasar un objeto de estilos personalizados a través de props y que ese objeto provenga de un archivo de estilos CSS Modules.

El código de `SelectableList` es el siguiente:

```js
import { useState, useEffect } from "react";
import defaultStyles from "./SelectableList.module.css";

interface SelectableListProps {
  items: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  styles?: { [key: string]: string }; // Objeto para los estilos
  mode?: "single" | "multiple";
}

export default function SelectableList({
  items,
  onSelectionChange,
  styles = defaultStyles,
  mode = "single",
}: SelectableListProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Llamamos a la función de callback cuando cambia la selección
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  function toggleItemSelection(item: string) {
    if (mode === "single") {
      setSelectedItems([item]);
      return;
    }

    if (mode === "multiple") {
      setSelectedItems((prevSelected) =>
        prevSelected.includes(item)
          ? prevSelected.filter((selectedItem) => selectedItem !== item)
          : [...prevSelected, item]
      );
    }
  }

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => toggleItemSelection(item)}
          className={`${styles.item} ${
            selectedItems.includes(item)
              ? styles.selected
              : styles.notSelected
          }
          `}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

Si al usarse el componente no se pasa un objeto de estilos personalizados,`styles` tomara los `defaultStyles` definidos en `SelectableList.module.css` para pasarlos como clases a los elementos del componente.

En cambio, si utilizamos el componente del siguiente modo:

```js
import customStyles from "./customStyles.module.css";
//...
<SelectableList
  items={itemsList}
  onSelectionChange={handleSelectionChange}
  styles={customStyles}
  mode="single"
/>;
//...
```

Los estilos seran tomados del objeto `customStyles` proveniente de `customStyles.module.css`.
