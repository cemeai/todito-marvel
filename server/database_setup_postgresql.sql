-- ====================================
-- Marvel Universe Explorer
-- PostgreSQL Database Setup Script
-- ====================================

-- ===== TABLA DE USUARIOS =====
-- Tabla de usuarios con autenticación completa y 2FA
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role SMALLINT DEFAULT 2, -- 1=admin, 2=user
    two_factor_secret VARCHAR(255) DEFAULT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== DATOS INICIALES =====
-- Usuario administrador por defecto (email: admin@marvel.com, password: "admin123")
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@marvel.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator Marvel', 1)
ON CONFLICT (email) DO NOTHING;

-- Usuario de prueba normal (email: user@marvel.com, password: "user123")
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('user@marvel.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User', 2)
ON CONFLICT (email) DO NOTHING;

-- ===== VERIFICACIÓN =====
-- Mostrar información de la base de datos creada
SELECT 'Database setup completed!' as status;
SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public';
SELECT COUNT(*) as total_users FROM users;
SELECT email, full_name, role FROM users;