---
title: Git - Guía de comandos
description: Git - Guía de comandos
date: 2023-12-18T04:37:29.009Z
preview: ""
draft: false
tags:
  - Git
categories: [destacado]
---

Documentación oficial: [https://git-scm.com/](https://git-scm.com/)

## Indice <!-- omit from toc -->

- [Configuración](#configuración)
- [Crear y clonar repositorios](#crear-y-clonar-repositorios)
- [Commits](#commits)
- [Comparar cambios](#comparar-cambios)
- [Revert \& Reset (deshacer cambios)](#revert--reset-deshacer-cambios)
- [Stash (almacenamiento temporal)](#stash-almacenamiento-temporal)
- [Repositorios remotos](#repositorios-remotos)
- [Ramas](#ramas)
- [Merge](#merge)
- [Rebase](#rebase)
- [Modos de trabajo](#modos-de-trabajo)
- [Borrar el historial de commits](#borrar-el-historial-de-commits)

## Configuración

**Ver la configuración actual:**
`git config --list`

**Configuración global del usuario:**
`git config --global user.name "Tu Nombre"`
`git config --global user.email "tu@email.com"`
Sin el `--global` la configuración se aplica solo al repositorio actual.

**Configuración de la rama por defecto:**
`git config --global init.defaultBranch main`
Si no se la configura utiliza `master` por defecto.

**Ver / editar el archivo de configuración:**
Editar el archivo `~/.gitconfig` (en mi Linux Mint `sudo xed ~/.gitconfig`)

**Configurar alias:**
`git config --global alias.ac "add -A && git commit"` » Crea un alias para agregar todos los cambios y realizar un commit en un solo comando.

**Ignorar archivos:**
Crear un archivo `.gitignore` en la raíz del repositorio para especificar patrones de archivos que Git debería ignorar.

## Crear y clonar repositorios

**Crear un nuevo repositorio:**
`git init` o `git init -b nombre_rama`

**Ver status del repositorio:**
`git status`

**Clonar un repositorio de GitHub:**
`git clone https://github.com/fedeholc/NuncaSupeProgramar.git`

**Agregar archivos al repositorio:**
`git add archivo`
Agrega un archivo específico a la staging area.

`git add .` o `git add -A`
Agrega todos los archivos nuevos y modificados a la staging area

## Commits

**Confirmar cambios en el repositorio:**
`git commit -m "Mensaje del commit"`
Realiza un commit con un mensaje en línea.

`git commit -a -m "Mensaje del commit"`
Realiza un commit automáticamente agregando y haciendo un commit de todos los archivos modificados (de los rastreados).

`git commit --amend --no-edit`
Modifica el commit más reciente. Se pueden agregar archivos (haciendo un add antes del amend). Se puede cambiar el mensaje del commit con -m en lugar de --no-edit, o sin nada y se abre el editor de texto.

**Ver historial de commits:**
`git log` o `git log --oneline` o `git log -nX` (X es la cantidad de commits a mostrar)

## Comparar cambios

**Comparar cambios:**
`git diff`  
Muestra las diferencias entre el área de trabajo y el área de preparación.

`git diff --staged`
Muestra las diferencias entre el área de preparación y el último commit.

`git diff commit1 commit2`
Muestra las diferencias entre dos commits específicos.

`git diff archivo`
Muestra las diferencias para un archivo específico entre el área de trabajo y el área de preparación.

`git diff HEAD^`
Muestra las diferencias entre el commit actual (HEAD) y su ancestro inmediato (HEAD^), es decir, el commit anterior al último commit.

## Revert & Reset (deshacer cambios)

**Recuperar archivos eliminados/modificados:**
`git checkout -- archivo`
Recupera el archivo (si no se hizo un commit desde que se eliminó) tomando la versión del commit previo.
Sirve también para descartar modificaciones al archivo.

**Revertir un commit**
`git revert hash_del_commit` se utiliza para deshacer un commit previo. A diferencia de `git reset`, que modifica la historia eliminando commits, `git revert` no reescribe el historial existente, agrega nuevos commits que deshacen los cambios.

`git revert HEAD` revierte el último commit.

Se pueden revertir commits específicos o rango de commits utilizando sus hash (se los referencia igual que con el comando reset, ver debajo).

También se pueden especificar archivos: `git revert HEAD index.html` revierte solo los cambios en el archivo index.html realizados en el último commit. Lo mismo vale para el `reset`.

**Remover commits del historial**
`git reset` se utiliza para deshacer cambios en el historial de commits.

_Modos de reset:_

- `--soft`: Deshace los commits, pero mantiene los cambios en el área de staging. No modifica los archivos en el directorio de trabajo.
- `--mixed` (predeterminado): Deshace los commits y también desmarca los cambios en el área de staging. Los cambios permanecen en el directorio de trabajo como modificaciones no en staging.
- `--hard`: Deshace los commits, desmarca los cambios en el área de staging y elimina las modificaciones en el directorio de trabajo.

_Formas de especificar/referenciar el commit:_

- Se puedes especificar un commit específico o utilizar notaciones como `HEAD` para referenciar el commit hacia el cual resetear.
- Por ejemplo, `git reset --soft HEAD^` deshace el último commit y mantiene los cambios en el área de staging.
- `HEAD~2` referencia al segundo ancestro de HEAD (dos atrás de HEAD).
- `HEAD~2..HEAD~4` referencia a los commits entre el segundo y cuarto ancestro de HEAD.
- En lugar de HEAD se puede utilizar el hash del commit.

**Forzar el push luego del reset (si es necesario)**
Después del reset, si ya se subieron los cambios a un repositorio remoto, puede ser necesario forzar el push para actualizarlo.

`git push --force origin nombre_de_rama` sobrescribe la historia del repositorio remoto con la historia local.
Al hacer un push normal, Git solo permite subir cambios si tu versión local está "adelante" de la versión remota. Si alguien más ha enviado cambios al repositorio remoto en la misma rama desde tu última descarga, Git te pedirá primero que integres esos cambios antes de subir tus propios cambios.
Un "force push" anula esta restricción y fuerza la subida de los cambios, incluso si hay cambios en el repositorio remoto que no tienes localmente.

_Se lo suele utilizar:_

- Cuando se han realizado cambios locales en el historial de commits (por ejemplo, mediante `git rebase` o `git commit --amend`) y se quiere enviar esos cambios al repositorio remoto.
- Si ocurrieron conflictos durante un push normal y esos conflictos se resolvieron localmente, un force push puede ser necesario para subir la versión resuelta.

_Precauciones importantes:_ un force push puede eliminar permanentemente commits del historial del repositorio remoto. Si otros colaboradores han trabajado en esos commits, forzar un push podría causar la pérdida de sus cambios.

## Stash (almacenamiento temporal)

`git stash` se utiliza para almacenar temporalmente cambios (sin hacer un commit) en un área llamada "stash", para recuperarlos/aplicarlos luego.

**Guardar cambios temporales:**
`git stash save "mensaje"`: Guarda los cambios en el stash con un mensaje descriptivo.

**Aplicar cambios del Stash:**
`git stash apply`: Aplica los cambios más recientes del stash al directorio de trabajo.
`git stash apply stash@{n}`: Aplica cambios de un stash específico.

**Listar Stashes:**
`git stash list`: Muestra una lista de stashes disponibles.

**Eliminar Stashes:**
`git stash drop`: Elimina el stash más reciente.
`git stash drop stash@{n}`: Elimina un stash específico.
`git stash clear`: Elimina todos los stashes.

**Aplicar y eliminar Stash:**
`git stash pop`: Aplica y elimina el stash más reciente.

**Guardar solo cambios en Staging:**
`git stash --keep-index`: Almacena solo los cambios que estén en la staging area.

**Situaciones de Uso Comunes:**
Se lo suele utilizar para guardar los cambios temporalmente antes de cambiar de rama, de realizar otra tarea, de resolver conflictos de merge, etc., y aplicarlos luego.

## Repositorios remotos

**Clonar un repositorio remoto:**
`git clone URL`

**Agregar un repositorio remoto:**
`git remote add origin URL`

**Descargar cambios del repositorio remoto e integrarlos:**
`git pull` (es como un `git fetch` seguido de un `git merge`)

**Subir cambios al repositorio remoto:**
`git push <repositorio> <rama>`
`git push` es como hacer `git push origin main` (si esos son los nombres por defecto de la rama y el repositorio remoto).
Para configurar la rama y el repositorio remoto por defecto: `git branch --set-upstream-to=origin/main`

**Divergencia entre repositorio local y remoto:**
En este caso, puede ser necesaria una fusión (merge) para combinar los cambios en el repositorio local. Se hace con: `git pull origin <nombre-rama>`.
Si los cambios locales deben sobrescribir a lo remoto, hacer `git push --force origin <nombre-rama>`.
Si se quiere que el repositorio local quede como el remoto, hacer `git reset --hard origin/<nombre-rama>`.
Si hay cambios locales sin confirmar y hay cambios en el repositorio remoto, Git puede evitar que se realicen ciertas operaciones hasta que se confirmen los cambios locales.

## Ramas

**Ver ramas:**
`git branch`

**Ver ramas remotas:**
`git branch -r`

**Crear una nueva rama:**
`git branch nombre_rama`

**Cambiar de rama:**
`git checkout nombre_rama`

**Crear una nueva rama y cambiar a ella:**
`git checkout -b nombre_rama`

**Borrar una rama**
`git branch -d nombre_rama` (solo si la rama ya fue integrada en otra rama)
o `git branch -D nombre_rama` para forzar el borrado (aunque no haya sido integrada).

## Merge

**Integrar cambios de una rama en otra:**
`git merge nombre_rama` (se debe estar en la rama en la que se quiere integrar los cambios)

`git merge --ff-only nombre_rama` Realiza un merge solo si es fast-forward (no hay conflictos). Si no es fast-forward, no realiza el merge y muestra un mensaje de error.

**Si hay conflictos:**
Sí al querer hacer un merge en main aparece el mensaje "Automatic merge failed; fix conflicts and then commit the result", significa que hay conflictos entre los cambios de la rama que se quiere integrar y los de la rama actual (Ej. sí quiero integrar la rama "dev" a "main" pero main fue modificada luego de que se creara "dev").
Las posibles soluciones son:

- Hacer `git merge --abort` para cancelar el merge, hacer un pull para actualizar la rama actual y luego volver a intentar el merge.
- Resolver los conflictos manualmente. Git muestra los archivos con conflictos y los marca con `<<<<<<< HEAD` (rama actual) y `>>>>>>> nombre_rama` (rama a integrar). Se deben editar los archivos para resolver los conflictos y luego hacer un commit.

## Rebase

`git rebase rama_base` (integra en la rama base los cambios de la rama en la que se encuentra)
A diferencia de merge (que crea un commit de merge), rebase reescribe la historia del proyecto, creando una nueva historia lineal.

![Diagrama de git merge vs rebase](/public/post-images/git-merge-rebase.webp)

No es conveniente usarlo en ramas que se comparten con otros colaboradores, ya que al reescribir la historia del proyecto puede causar conflictos.

**rebase interactivo**
`git rebase -i rama_base` el rebase interactivo, en lugar de tomar todos los commits y moverlos a la rama_base, permite reordenar esos commits, eliminarlos, modificarlos, etc.
Una explicación más detallada acá: [https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)

## Modos de trabajo

**Posibles modos de trabajo cuando no se quieren guardar todos los commits en el historial**

1. Con uso de soft-reset:

- Crear una rama de trabajo, y realizar tantos commits/subramas como se requiera.
- Luego para fusionar sin conservar ese historial, hacer un git-reset al commit original donde se creó la rama. Todas las modificaciones son ahora cambios locales no commiteados.
- (volver a ) Hacer commit y fusionar.
  De ese modo se pueden enviar las ramas temporales al repositorio remoto, algo que no se puede hacer con un stash.
  Con este modo de trabajo, técnicamente los commits originales quedan guardados, pero desvinculados, lo cual de alguna manera evita perder trabajo, ya que se pueden recuperar un commits desvinculados.

2. Con uso de rebase:

- Crear una rama de trabajo, y realizar tantos commits/subramas como se requiera.
- Luego para fusionar sin conservar ese historial, hacer un rebase interactivo al commit original donde se creó la rama.
- En el rebase interactivo, se pueden combinar varios commits en uno solo con squash, o eliminarlos, etc.

## Borrar el historial de commits

Eliminar la carpeta .git puede causar problemas en el repositorio de Git. Para borrar todo el historial de commits pero conservar el código en su estado actual, se lo puede hacer del siguiente modo:

1. Cambiar de rama
   ```
   git checkout --orphan latest_branch
   ```
   La opción --orphan se utiliza para crear una nueva rama sin historial de confirmaciones. Es decir, la nueva rama comienza como si estuviera completamente vacía, sin compartir historial de confirmaciones con ninguna otra rama existente.
2. Agregar todos los archivos
   ```
   git add -A
   ```
3. Confirmar los cambios
   ```
   git commit -am "mensaje de confirmación"
   ```
4. Eliminar la rama
   ```
   git branch -D main
   ```
5. Renombrar la rama actual a main
   ```
   git branch -m main
   ```
6. Finalmente, actualizar forzosamente el repositorio
   ```
   git push -f origin main
   ```
