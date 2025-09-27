-- ====================================
-- Marvel Universe Explorer
-- Database Setup Script
-- ====================================

-- Crear base de datos Marvel App
CREATE DATABASE IF NOT EXISTS marvel_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marvel_app;

-- ===== TABLA DE USUARIOS =====
-- Tabla de usuarios con autenticación completa y 2FA
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
    
    -- Índices para optimización
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== DATOS INICIALES =====
-- Usuario administrador por defecto (email: admin@marvel.com, password: "admin123")
INSERT IGNORE INTO users (email, password_hash, full_name, role) VALUES 
('admin@marvel.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator Marvel', 1);

-- Usuario de prueba normal (email: user@marvel.com, password: "user123")
INSERT IGNORE INTO users (email, password_hash, full_name, role) VALUES 
('user@marvel.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User', 2);

-- ===== VERIFICACIÓN =====
-- Mostrar información de la base de datos creada
SELECT 'Database setup completed!' as status;
SHOW TABLES;
SELECT COUNT(*) as total_users FROM users;
SELECT email, full_name, role FROM users;