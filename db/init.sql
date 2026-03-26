CREATE TABLE videogames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(100),
    format VARCHAR(50),
    completeness VARCHAR(50),
    region VARCHAR(50),
    store_origin VARCHAR(100),
    purchase_price DECIMAL(10, 2),
    acquisition_date DATE,
    play_state VARCHAR(50)
);

CREATE TABLE consoles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100),
    color_edition VARCHAR(100),
    status VARCHAR(50),
    storage_capacity VARCHAR(50),
    included_cables VARCHAR(255)
);

CREATE TABLE accessories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    connectivity VARCHAR(100)
);

CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_type VARCHAR(50), -- 'videogame', 'console', 'accessory'
    item_id INT,
    borrower_name VARCHAR(255) NOT NULL,
    loan_date DATE,
    return_date DATE,
    status VARCHAR(50) DEFAULT 'Borrowed'
);

-- Optional: sample data
INSERT INTO videogames (title, platform, format, completness, region, play_state) 
VALUES ('Super Mario Odyssey', 'Nintendo Switch', 'Digital', 'Digital', 'USA', 'Pendiente');
