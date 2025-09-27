# 🗄️ Database Documentation

## Scripts de Base de Datos

### 📁 Archivos disponibles

| Archivo | Propósito | Cuándo usar |
|---------|-----------|-------------|
| `database_setup.sql` | Setup inicial desarrollo | Primer setup local |
| `database_setup_production.sql` | Setup producción | Deploy a servidor |
| `database_migration.sql` | Actualizaciones | Migrar DB existente |

## 🚀 Uso

### Desarrollo (Primera vez)
```bash
mysql -u root -p < database_setup.sql
```

### Producción (Primera vez)
```bash
mysql -u root -p < database_setup_production.sql
```

### Migración (DB existente)
```bash
mysql -u root -p < database_migration.sql
```

## 📊 Estructura de la Base de Datos

### Tabla: `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID único del usuario |
| `email` | VARCHAR(255) | Email único del usuario |
| `password_hash` | VARCHAR(255) | Hash bcrypt del password |
| `full_name` | VARCHAR(255) | Nombre completo |
| `role` | TINYINT | Rol: 1=admin, 2=user |
| `two_factor_secret` | VARCHAR(255) | Secret TOTP para 2FA |
| `two_factor_enabled` | BOOLEAN | Si 2FA está activo |
| `is_active` | BOOLEAN | Si la cuenta está activa |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

### Índices Optimizados

- `PRIMARY KEY` - id
- `UNIQUE KEY` - email
- `INDEX idx_email` - búsquedas por email
- `INDEX idx_role` - filtros por rol
- `INDEX idx_active` - usuarios activos
- `INDEX idx_created` - ordenar por fecha
- `INDEX idx_2fa_enabled` - usuarios con 2FA

## 👥 Usuarios por Defecto

### Desarrollo
- **Admin**: `admin@marvel.com` / `admin123`
- **User**: `user@marvel.com` / `user123`

### Producción
- **Admin**: `admin@tu-dominio.com` / `admin123`
- ⚠️ **CAMBIAR credenciales después del primer login**

## 🔒 Seguridad

### Passwords
- Encriptados con **bcrypt** (rounds: 10 dev, 12 prod)
- Hash ejemplo: `$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`

### 2FA
- Algoritmo: **TOTP** (Time-based One-time Password)
- Compatible con: Google Authenticator, Authy, etc.
- Secret almacenado encriptado en DB

## 📈 Optimizaciones

### Desarrollo
- Charset: utf8mb4
- Engine: InnoDB
- Índices básicos

### Producción
- Buffer pool: 1GB
- Max connections: 500
- Query cache: 256MB
- Índices adicionales para performance

## 🔧 Comandos Útiles

### Verificar setup
```sql
USE marvel_app;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

### Ver usuarios
```sql
SELECT id, email, full_name, role, two_factor_enabled, created_at FROM users;
```

### Estadísticas
```sql
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN role = 1 THEN 1 ELSE 0 END) as admins,
  SUM(CASE WHEN two_factor_enabled = 1 THEN 1 ELSE 0 END) as users_with_2fa
FROM users;
```