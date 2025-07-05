-- Crear tabla de categorías si no existe
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos si no existe
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Insertar categorías básicas si no existen
INSERT INTO categories (name, description, display_order) 
SELECT * FROM (VALUES
  ('Bebidas Calientes', 'Café, té y otras bebidas calientes', 1),
  ('Bebidas Frías', 'Jugos, refrescos y bebidas heladas', 2),
  ('Desayunos', 'Opciones para comenzar el día', 3),
  ('Almuerzos', 'Platos principales y comidas completas', 4),
  ('Postres', 'Dulces y postres caseros', 5),
  ('Snacks', 'Bocadillos y aperitivos', 6)
) AS v(name, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = v.name);
