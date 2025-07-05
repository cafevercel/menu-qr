-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  category_id INTEGER REFERENCES categories(id),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías de ejemplo
INSERT INTO categories (name, description, display_order) VALUES
('Bebidas Calientes', 'Café, té y otras bebidas calientes', 1),
('Bebidas Frías', 'Jugos, refrescos y bebidas heladas', 2),
('Desayunos', 'Opciones para comenzar el día', 3),
('Almuerzos', 'Platos principales y comidas completas', 4),
('Postres', 'Dulces y postres caseros', 5),
('Snacks', 'Bocadillos y aperitivos', 6)
ON CONFLICT DO NOTHING;
