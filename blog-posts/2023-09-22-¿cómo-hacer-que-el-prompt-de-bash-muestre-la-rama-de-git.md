---
title: ¿Cómo hacer que el prompt de bash muestre la rama de git?
description: ""
date: 2023-09-22T13:38:05.410Z
preview: ""
draft: false
tags: [git, bash]
categories: []
---

Simplemente agregar las siguientes lineas al archivo ~/.bashrc

```bash
parse_git_branch() {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
export PS1="\u@\h \[\e[32m\]\w \[\e[91m\]\$(parse_git_branch)\[\e[00m\]$ "
```
