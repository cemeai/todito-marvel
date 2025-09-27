-- ====================================
-- Marvel Universe Explorer - PRODUCTION
-- Database Setup Script
-- ====================================

-- Crear base de datos para producción
CREATE DATABASE IF NOT EXISTS marvel_app_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marvel_app_prod;

-- ===== TABLA DE USUARIOS =====
-- Tabla de usuarios optimizada para producción
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role TINYINT DEFAULT 2 COMMENT '1=admin, 2=user',
    two_factor_secret VARCHAR(255) DEFAULT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices optimizados para producción
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    INDEX idx_created (created_at),
    INDEX idx_2fa_enabled (two_factor_enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== CONFIGURACIÓN DE PRODUCCIÓN =====
-- Solo crear usuario administrador inicial
-- IMPORTANTE: Cambiar credenciales después del primer login
INSERT IGNORE INTO users (email, password_hash, full_name, role) VALUES 
('admin@tu-dominio.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Production Administrator', 1);

-- ===== VERIFICACIÓN =====
SELECT 'Production database setup completed!' as status;
SHOW TABLES;
SELECT COUNT(*) as total_users FROM users;

-- ===== NOTAS DE SEGURIDAD =====
-- 1. Cambiar email y password del admin después del primer login
-- 2. Habilitar 2FA obligatoriamente en producción  
-- 3. Configurar backup automático de la base de datos
-- 4. Usar conexiones SSL/TLS únicamente
-- 5. Las optimizaciones de DB se configuran en el servidor, no aquí