-- ====================================
-- Marvel Universe Explorer
-- Database Migration Script
-- Para actualizar bases de datos existentes
-- ====================================

USE marvel_app;

-- ===== VERIFICAR VERSIÓN ACTUAL =====
-- Crear tabla de versiones si no existe
CREATE TABLE IF NOT EXISTS db_version (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- ===== MIGRACIÓN V1.1 =====
-- Agregar índices faltantes si no existen
SELECT 'Aplicando migración v1.1...' as status;

-- Agregar índice para 2FA si no existe
SET @index_exists = (
    SELECT COUNT(1) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_schema = DATABASE() 
    AND table_name = 'users' 
    AND index_name = 'idx_2fa_enabled'
);

SET @sql = IF(@index_exists = 0, 
    'ALTER TABLE users ADD INDEX idx_2fa_enabled (two_factor_enabled)', 
    'SELECT "Index idx_2fa_enabled already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ===== MIGRACIÓN V1.2 =====
-- Optimizar charset si es necesario
SELECT 'Verificando charset de tabla...' as status;

ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ===== REGISTRAR MIGRACIÓN =====
INSERT IGNORE INTO db_version (version, description) VALUES 
('1.1', 'Added 2FA index optimization'),
('1.2', 'Updated charset to utf8mb4');

-- ===== VERIFICACIÓN FINAL =====
SELECT 'Migration completed!' as status;
SELECT * FROM db_version ORDER BY applied_at DESC;
SHOW TABLE STATUS LIKE 'users';

-- ===== ESTADÍSTICAS =====
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN role = 1 THEN 1 ELSE 0 END) as admin_users,
    SUM(CASE WHEN role = 2 THEN 1 ELSE 0 END) as regular_users,
    SUM(CASE WHEN two_factor_enabled = 1 THEN 1 ELSE 0 END) as users_with_2fa,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
FROM users;