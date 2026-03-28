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