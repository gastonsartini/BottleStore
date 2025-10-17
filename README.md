# BottleStore - E-commerce de Botellas Premium

Una tienda online moderna y completa para la venta de botellas de agua premium, construida con Next.js, Supabase y Tailwind CSS.

## 🚀 Características

- **Frontend moderno**: Construido con Next.js 14 y React 18
- **Base de datos**: Supabase con PostgreSQL
- **Autenticación**: Sistema de autenticación completo con Supabase Auth
- **Panel de administración**: Gestión completa de productos, categorías y órdenes
- **Carrito de compras**: Sistema de carrito persistente con Zustand
- **Pagos**: Integración con MercadoPago
- **Responsive**: Diseño completamente responsive con Tailwind CSS
- **SEO optimizado**: Meta tags, sitemap y robots.txt
- **Analytics**: Integración con Meta Pixel para tracking

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estado**: Zustand
- **Pagos**: MercadoPago
- **Iconos**: Lucide React
- **Deployment**: Netlify

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repo-url>
   cd bottlestore-ecommerce
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Configura la base de datos**
   
   Ejecuta las migraciones de Supabase:
   ```bash
   # Si tienes Supabase CLI instalado
   supabase db push
   
   # O ejecuta manualmente los archivos SQL en supabase/migrations/
   ```

5. **Crea el usuario administrador**
   
   Visita `/setup` en tu aplicación local para crear el usuario administrador inicial.

## 🚀 Desarrollo

```bash
# Inicia el servidor de desarrollo
npm run dev

# Construye para producción
npm run build

# Inicia el servidor de producción
npm start

# Verifica tipos de TypeScript
npm run typecheck

# Ejecuta el linter
npm run lint
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API routes
│   ├── carrito/           # Página del carrito
│   ├── checkout/          # Proceso de compra
│   ├── productos/         # Catálogo de productos
│   └── ...
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
│   └── supabase/         # Cliente de Supabase
├── store/                 # Estado global (Zustand)
├── types/                 # Definiciones de TypeScript
├── utils/                 # Funciones utilitarias
└── supabase/             # Configuración de Supabase
    ├── functions/        # Edge Functions
    └── migrations/       # Migraciones de base de datos
```

## 🗄️ Base de Datos

El proyecto utiliza las siguientes tablas principales:

- **products**: Productos del catálogo
- **categories**: Categorías de productos
- **orders**: Órdenes de compra
- **admin_users**: Usuarios administradores
- **coupons**: Cupones de descuento
- **shipping_zones**: Zonas de envío
- **store_settings**: Configuración de la tienda

## 🔐 Autenticación y Autorización

- **Usuarios públicos**: Pueden ver productos y realizar compras
- **Administradores**: Acceso completo al panel de administración
- **RLS (Row Level Security)**: Implementado en todas las tablas

## 💳 Pagos

Integración completa con MercadoPago:
- Procesamiento de pagos con tarjeta
- Webhooks para actualización de estados
- Manejo de pagos pendientes y rechazados

## 📱 Características del Frontend

- **Responsive Design**: Optimizado para móviles y desktop
- **Carrito persistente**: Se mantiene entre sesiones
- **Búsqueda y filtros**: Por categoría, material, capacidad
- **SEO optimizado**: Meta tags dinámicos por producto
- **Loading states**: Indicadores de carga en toda la aplicación
- **Error handling**: Manejo robusto de errores

## 🛡️ Seguridad

- **Validación de datos**: En frontend y backend
- **Sanitización**: Prevención de XSS
- **CORS configurado**: Para APIs y webhooks
- **Environment variables**: Configuración segura

## 🚀 Deployment

### Netlify (Recomendado)

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Deploy automático en cada push

### Variables de entorno para producción:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

## 📊 Analytics y Tracking

- **Meta Pixel**: Tracking de eventos de e-commerce
- **Eventos personalizados**: ViewContent, AddToCart, Purchase
- **Conversiones**: Seguimiento completo del funnel de ventas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y consultas:
- Email: admin@bottlestore.com
- WhatsApp: +54 9 11 1234-5678

## 🔄 Changelog

### v1.0.0
- Lanzamiento inicial
- Sistema completo de e-commerce
- Panel de administración
- Integración con MercadoPago
- Diseño responsive

### Última actualización: 2025-10-12
- Sistema funcionando correctamente