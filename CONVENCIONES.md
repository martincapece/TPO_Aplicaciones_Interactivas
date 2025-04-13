# 📘 Convenciones de Ramas y Commits

Este documento define las convenciones que seguiremos para el control de versiones en el desarrollo del eCommerce.

---

## 🌿 Convención de Ramas

Usaremos un modelo basado en **Git Flow**, adaptado a nuestras necesidades.

### Ramas principales
- `main`: Rama de **producción**. Siempre debe contener el código en estado **estable y desplegable**.
- `develop`: Rama de **desarrollo**. Desde aquí parten las ramas de funcionalidades, y se hace merge una vez aprobadas.

### Ramas secundarias
- `feature/{nombre}`: Para el desarrollo de **nuevas funcionalidades**.  
  _Ejemplo:_ `feature/carrito-compras`
- `fix/{nombre}`: Para **corrección de errores no críticos**.  
  _Ejemplo:_ `fix/error-precio-negativo`
- `hotfix/{nombre}`: Para **errores críticos** en producción.  
  _Ejemplo:_ `hotfix/checkout-crash`
- `refactor/{nombre}`: Para **mejoras internas** del código sin cambiar su funcionalidad.  
  _Ejemplo:_ `refactor/ordenamiento-categorias`
- `test/{nombre}`: Para **pruebas** o pruebas A/B **temporales**.  
  _Ejemplo:_ `test/nuevo-banner-home`

---

## ✍️ ¿Cómo crear una nueva funcionalidad?

Sigue estos pasos para crear una nueva funcionalidad de forma ordenada:

### 1. Crear y cambiar a una nueva rama

Usa un nombre **descriptivo**, en minúscula y separado por guiones.

```bash
git checkout -b feature/nombre-funcionalidad
```

---

### 2. Agregar los cambios

Asegúrate de agregar los archivos modificados que deseas subir:

```bash
git add .
```

---

### 3. Hacer commit con un mensaje claro y estructurado

Sigue la convención de mensajes (`feat`, `fix`, `refactor`, etc.):

```bash
git commit -m "feat: implementar buscador de productos"
```

---

### 4. Subir la rama al repositorio remoto

```bash
git push origin feature/nombre-funcionalidad
```

> Si es la primera vez que haces push de esa rama:
> ```bash
> git push -u origin feature/nombre-funcionalidad
> ```

---

### 5. Crear un Pull Request en GitHub

1. Ve a [https://github.com](https://github.com)
2. Verás una notificación para crear un **Pull Request**
3. Asegúrate de que el PR sea hacia la rama `develop`
4. Agrega una descripción clara.

---

✅ ¡Listo! Ahora solo espera la revisión y aprobación para hacer merge.
