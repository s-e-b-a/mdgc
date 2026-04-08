-- =========================================================
-- Gestión de Limpieza (Idempotencia)
-- =========================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS accessories;
DROP TABLE IF EXISTS consoles;
DROP TABLE IF EXISTS videogames;
DROP TABLE IF EXISTS platforms;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- Tabla: platforms
-- =========================================================
CREATE TABLE platforms (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Tabla: videogames
-- =========================================================
CREATE TABLE videogames (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    platform_id INT NOT NULL,
    format VARCHAR(100) NULL,
    completeness VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    store_origin VARCHAR(255) NULL,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    acquisition_date DATETIME NULL,
    play_state VARCHAR(100) NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_videogames_platform
        FOREIGN KEY (platform_id)
        REFERENCES platforms(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_videogames_platform_id
    ON videogames(platform_id);

CREATE INDEX idx_videogames_title
    ON videogames(title);

-- =========================================================
-- Tabla: consoles
-- =========================================================
CREATE TABLE consoles (
    id INT NOT NULL AUTO_INCREMENT,
    model VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NULL,
    color_edition VARCHAR(255) NULL,
    status VARCHAR(100) NULL,
    storage_capacity VARCHAR(100) NULL,
    included_cables TEXT NULL,
    platform_id INT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_consoles_platform
        FOREIGN KEY (platform_id)
        REFERENCES platforms(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_consoles_platform_id
    ON consoles(platform_id);

CREATE INDEX idx_consoles_model
    ON consoles(model);

-- =========================================================
-- Tabla: accessories
-- =========================================================
CREATE TABLE accessories (
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NULL,
    connectivity VARCHAR(100) NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_accessories_type
    ON accessories(type);

-- =========================================================
-- Tabla: loans
-- =========================================================
CREATE TABLE loans (
    id INT NOT NULL AUTO_INCREMENT,
    item_type VARCHAR(100) NOT NULL,
    item_id INT NOT NULL,
    borrower_name VARCHAR(255) NOT NULL,
    loan_date VARCHAR(50) NOT NULL,
    return_date VARCHAR(50) NULL,
    status VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_loans_item
    ON loans(item_type, item_id);

CREATE INDEX idx_loans_borrower
    ON loans(borrower_name);

CREATE INDEX idx_loans_status
    ON loans(status);

-- =========================================================
-- Datos de ejemplo (Seed Data)
-- =========================================================

-- Platforms
INSERT INTO platforms (id, name) VALUES 
(1, 'PlayStation 5'),
(2, 'Nintendo Switch'),
(3, 'PC'),
(4, 'Xbox Series X'),
(5, 'Nintendo 64');

-- VideoGames
INSERT INTO videogames (title, platform_id, format, completeness, region, store_origin, purchase_price, acquisition_date, play_state) VALUES 
('Elden Ring', 1, 'Físico', 'Nuevo', 'NTSC', 'Amazon', 59.99, '2024-03-01 10:00:00', 'Jugando'),
('The Legend of Zelda: Tears of the Kingdom', 2, 'Físico', 'CIB', 'NTSC', 'Best Buy', 69.99, '2023-05-12 09:00:00', 'Completado'),
('Counter-Strike 2', 3, 'Digital', 'N/A', 'Todas', 'Steam', 0.00, '2023-09-27 15:00:00', 'Jugando'),
('Super Mario 64', 5, 'Físico', 'Solo cartucho', 'NTSC', 'Mercado Libre', 45.00, '2022-11-20 12:00:00', 'Pendiente');

-- Consoles
INSERT INTO consoles (model, serial_number, color_edition, status, storage_capacity, included_cables, platform_id) VALUES 
('PS5 Standard', 'AK123456789', 'Blanco', 'Funcional', '825GB', 'HDMI, Power, USB-C', 1),
('Nintendo Switch OLED', 'XJW1000234', 'Neon', 'Funcional', '64GB', 'HDMI, Power', 2);

-- Accessories
INSERT INTO accessories (type, brand, connectivity) VALUES 
('DualSense Controller', 'Sony', 'Bluetooth'),
('Pro Controller', 'Nintendo', 'Bluetooth'),
('Logitech G Pro Mouse', 'Logitech', 'Alámbrico');

-- Loans
INSERT INTO loans (item_type, item_id, borrower_name, loan_date, status) VALUES 
('VideoGame', 1, 'Juan Pérez', '2024-04-01', 'Prestado'),
('Console', 1, 'María García', '2024-03-15', 'Prestado');