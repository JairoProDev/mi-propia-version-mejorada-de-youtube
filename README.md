# MiTube - Clon Avanzado de YouTube

![MiTube Logo](frontend/public/logo192.png)

## Descripción

MiTube es una plataforma de compartición de videos inspirada en YouTube, desarrollada con tecnologías modernas como React, Node.js, MongoDB y Express. Este proyecto implementa todas las funcionalidades principales de YouTube con un enfoque en el rendimiento, la experiencia de usuario y un diseño moderno e intuitivo.

## Características

- 🎥 Reproducción de videos con controles avanzados
- 👤 Sistema de autenticación completo
- 💬 Comentarios en tiempo real
- 👍 Sistema de likes/dislikes
- 🔍 Búsqueda avanzada de videos
- 🎯 Recomendaciones personalizadas
- 📱 Diseño totalmente responsive
- 🌙 Modo oscuro/claro
- 📋 Historial de visualización
- 📺 Reproducción automática
- 🖼️ Modo picture-in-picture
- 📝 Edición de perfiles
- 🔔 Sistema de notificaciones
- 📊 Panel de estadísticas para creadores

## Tecnologías Utilizadas

### Frontend
- React 18
- Redux Toolkit para gestión de estado
- React Router para navegación
- Styled Components para estilos
- Material UI para componentes
- Axios para peticiones HTTP

### Backend
- Node.js con Express
- MongoDB con Mongoose
- JWT para autenticación
- Socket.io para funcionalidades en tiempo real
- Cloudinary para almacenamiento de archivos multimedia

## Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

### Pasos para Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JairoProDev/mitube.git
   cd mitube
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd server
   npm install
   ```

3. **Configurar variables de entorno del backend**
   Crea un archivo `.env` en la carpeta `server` con el siguiente contenido:
   ```
   MONGO=tu_url_de_mongodb
   JWT_SECRET=tu_clave_secreta_jwt
   ```

4. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Iniciar el servidor**
   ```bash
   cd ../server
   npm start
   ```

6. **Iniciar el cliente**
   ```bash
   cd ../frontend
   npm start
   ```

## Estructura del Proyecto

```
mitube/
├── frontend/            # Aplicación React
│   ├── public/          # Archivos estáticos
│   └── src/             # Código fuente
│       ├── components/  # Componentes reutilizables
│       ├── pages/       # Páginas de la aplicación
│       ├── hooks/       # Custom hooks
│       ├── utils/       # Utilidades
│       ├── services/    # Servicios API
│       ├── assets/      # Imágenes y recursos
│       └── redux/       # Estado global con Redux
├── server/              # Servidor Node.js/Express
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas API
│   ├── middlewares/     # Middlewares
│   ├── utils/           # Utilidades
│   └── tests/           # Tests
└── README.md            # Documentación
```

## Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

[Tu Nombre] - [tu.email@example.com]

Enlace del Proyecto: [https://github.com/tu-usuario/mitube](https://github.com/tu-usuario/mitube)

## Agradecimientos

- [YouTube](https://www.youtube.com) por la inspiración
- [React Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
