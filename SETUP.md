# Guía de Configuración - BottleStore

Esta guía te ayudará a configurar el proyecto BottleStore desde cero.

## 📋 Prerrequisitos

- Node.js 18+ instalado
- Cuenta de Supabase
- Cuenta de MercadoPago (para pagos)
- Git instalado

## 🚀 Configuración Paso a Paso

### 1. Clonar y Configurar el Proyecto

```bash
# Clona el repositorio
git clone <tu-repo-url>
cd bottlestore-ecommerce

# Instala las dependencias
npm install
```

### 2. Configurar Supabase

1. **Crear un nuevo proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una nueva organización y proyecto
   - Anota la URL y las claves del proyecto

2. **Configurar la base de datos**
   - Ve a la sección SQL Editor en tu dashboard de Supabase
   - Ejecuta los archivos de migración en orden:
     ```sql
     -- Ejecuta cada archivo en supabase/migrations/ en orden cronológico
     -- 20251004015431_create_ecommerce_schema.sql
     -- 20251004131440_add_auth_and_settings.sql
     -- 20251004132057_fix_admin_users_policy.sql
     -- 20251006_fix_orders_rls.sql
     ```

3. **Configurar RLS (Row Level Security)**
   - Las políticas de seguridad se crean automáticamente con las migraciones
   - Verifica que RLS esté habilitado en todas las tablas

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_mercadopago

# Aplicación
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar MercadoPago

1. **Crear cuenta de desarrollador**
   - Ve a [developers.mercadopago.com](https://developers.mercadopago.com)
   - Crea una aplicación
   - Obtén tu Access Token de prueba y producción

2. **Configurar webhooks** (opcional para desarrollo)
   - URL del webhook: `https://tu-dominio.com/api/webhooks/mercadopago`
   - Eventos: `payment`

### 5. Poblar la Base de Datos

1. **Crear usuario administrador**
   ```bash
   # Inicia el servidor de desarrollo
   npm run dev
   
   # Ve a http://localhost:3000/setup
   # Haz clic en "Crear Usuario Admin"
   ```

2. **Agregar datos de ejemplo** (opcional)
   ```sql
   -- Ejecuta en Supabase SQL Editor
   
   -- Insertar categorías
   INSERT INTO categories (name, slug, description) VALUES
   ('Botellas Metálicas', 'botellas-metalicas', 'Botellas de acero inoxidable premium'),
   ('Botellas Plásticas', 'botellas-plasticas', 'Botellas plásticas libres de BPA');
   
   -- Insertar configuración de tienda
   INSERT INTO store_settings (store_name, store_email, store_phone, currency) VALUES
   ('BottleStore', 'admin@bottlestore.com', '+54 9 11 1234-5678', 'ARS');
   
   -- Insertar métodos de pago
   INSERT INTO payment_methods (name, type, enabled, instructions) VALUES
   ('MercadoPago', 'mercadopago', true, 'Paga con tarjeta de crédito, débito o efectivo');
   
   -- Insertar métodos de envío
   INSERT INTO shipping_methods (name, description, price, enabled, estimated_days) VALUES
   ('Envío Estándar', 'Envío a domicilio', 850.00, true, '3-5 días'),
   ('Envío Express', 'Envío rápido', 1200.00, true, '1-2 días');
   ```

### 6. Configurar Edge Functions (opcional)

Si planeas usar las Edge Functions de Supabase:

```bash
# Instala Supabase CLI
npm install -g supabase

# Inicia sesión
supabase login

# Vincula tu proyecto
supabase link --project-ref tu-project-ref

# Despliega las funciones
supabase functions deploy mercadopago-webhook
supabase functions deploy create-mercadopago-preference
```

### 7. Probar la Aplicación

```bash
# Inicia el servidor de desarrollo
npm run dev

# Ve a http://localhost:3000
# Prueba las siguientes funcionalidades:
# - Navegación por productos
# - Agregar al carrito
# - Proceso de checkout
# - Panel de administración (/admin)
```

## 🔧 Configuración de Producción

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_produccion
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### Deployment en Netlify

1. **Conectar repositorio**
   - Ve a Netlify y conecta tu repositorio de GitHub
   - Configura el comando de build: `npm run build`
   - Directorio de publicación: `.next`

2. **Configurar variables de entorno**
   - Agrega todas las variables de entorno en la configuración de Netlify

3. **Configurar redirects**
   - Netlify debería detectar automáticamente que es una aplicación Next.js

## 🛠️ Solución de Problemas

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
- Verifica que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de agregar variables

### Error de conexión a Supabase
- Verifica que las URLs y claves sean correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Problemas con MercadoPago
- Verifica que el Access Token sea válido
- Para pruebas, usa el Access Token de sandbox
- Revisa los logs en el dashboard de MercadoPago

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs de la consola del navegador
2. Verifica los logs del servidor (`npm run dev`)
3. Consulta la documentación de Supabase y MercadoPago
4. Abre un issue en el repositorio de GitHub

## ✅ Checklist de Configuración

- [ ] Node.js 18+ instalado
- [ ] Proyecto clonado y dependencias instaladas
- [ ] Proyecto de Supabase creado
- [ ] Migraciones de base de datos ejecutadas
- [ ] Variables de entorno configuradas
- [ ] Usuario administrador creado
- [ ] MercadoPago configurado
- [ ] Aplicación funcionando en desarrollo
- [ ] Datos de prueba agregados (opcional)
- [ ] Edge Functions desplegadas (opcional)
- [ ] Aplicación desplegada en producción (opcional)