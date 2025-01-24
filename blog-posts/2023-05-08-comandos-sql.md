---
title: SQL - Comandos básicos
description: "Comandos básicos SQL"
date: 2023-05-08T14:50:14.232Z
preview: ""
draft: false
tags: [SQL]
categories: []
---

**Crear Tabla con clave primaria**

```sql
create table nombreTabla (
  columna1 int auto_increment NOT NULL,
  columna2 varchar(10),
  columna3 boolean,
  constraint pk_nombreTabla primary key (columna1)
);
```

**Crear Tabla con claves primaria y foránea**

```sql
create table nombreTabla (
  columna1 int,
  columna2 varchar(10),
  constraint pk_nombreTabla primary key (columna1),
  constraint fk_nombreTabla foreign key (columnaOtraTabla) references OtraTabla (columnaOtraTabla)
);
```

**Crear Tabla con OK compuesta por FKs**

```sql
create table LibroAutor (
  CodLibro int,
  CodAutor int,
 s);
```

**Insertar valores**

```sql
INSERT INTO alumno (legajo, nombre, apellido) VALUES
  (123, "María", "Lopez"),
  (234, "Mirta", "Hilario");
```

```sql
INSERT INTO alumno VALUES
  (123, "María", "Lopez"),
  (234, "Mirta", "Hilario");
```

- Ambas instrucciones son válidas, la primera contiene los atributos de la tabla alumno, y la segunda no. Se debe tener cuidado en el segundo formato de respetar el ingreso de los datos según el orden de los atributos dados en la creación de la tabla. Si el dato es auto_increment y no se especifica la lista de atributos antes del Values, se debe dejar el lugar correspondiente a ese dato.

**Formato básico de consulta**

```sql
SELECT atributos
  FROM Tablas
    WHERE predicado;
```

**Operadores para SELECT**

- `SELECT DISTINCT atributo` (no muestra duplicados)
- `WHERE atributo BETWEEN 10 AND 20`
- `SELECT \* FROM tablaNombre N, tablaCurso C WHERE N.Atributo = C.Atributo;` (renombra las tablas).
- `ORDER BY atributo;`
- `WHERE variable LIKE "Ma%";` (o %Ma%, o "%Ma", etc, para buscar tuplas que contengan cierta información).

**Funciones de agregación**

- `SELECT AVG (atributo)` --> Promedio de todas las tuplas
- `SELECT COUNT(\*) FROM Tabla WHERE N = 10;` --> Retorna cantidad de tuplas con esa condición.
- `SELECT MAX(atributo)` --> Retorna el valor más grande
- `SELECT MIN(atributo)` --> Retorna el valor más pequeño
- `SELECT SUM(atributo)` --> Retorna la suma de todas las tuplas

**Funciones de agrupación**

- `GROUP BY` agrupa las tuplas según criterio, en general usado con funciones de agregación. Ej, para listar cantidad de clientes por país: `SELECT COUNT(clienteID), Pais FROM Clientes GROUP BY Pais;`

- `HAVING` indica la condición de filtro que debe respetar un grupo. Dentro de esta clausula se pueden utilizar funciones de agregación (en las WHERE no, por eso su existencia). Ej:
- `SELECT A.nombre, nombre_materia FROM alumno A, examen E, materia M WHERE A.legajo = E.legajo AND E.idMateria = M.idMateria GROUP BY A.nombre materia, nombre_materia HAVING AVG (E.nota) > 6;` Muestra por alumno el nombre de las materias cuyo promedio sea mayor a 6.

**Operaciones de pertenencia a conjuntos**

- IN: Permite comprobar si un elemento es parte de un conjunto. Para cada tupla del resultado se verifica que se encuentre en el resultado de la subconsulta. Ej: -`SELECT legajo FROM alumno WHERE idCarrera IN (SELECT idCarrera FROM carrera WHERE duracion = 5);`
- NOT IN: como la anterior pero se fija que no sea parte del conjunto.

**Operaciones con valores nulos**

- WHERE atributo IS NULL / NOT NULL (se usa para preguntar por atributos que estén en NULL o no, lo cual no se podría hacer de otra forma).

**Borrar**

- `DELETE FROM Tabla WHERE condicion;`

**Modificar**

- `UPDATE tabla SET atributo = algo WHERE condicion;`
