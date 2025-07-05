-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, category_id, is_featured) VALUES
-- Bebidas Calientes
('Café Americano', 'Café negro tradicional, intenso y aromático', 2.50, 1, true),
('Cappuccino', 'Espresso con leche vaporizada y espuma cremosa', 3.50, 1, true),
('Latte', 'Espresso suave con abundante leche vaporizada', 4.00, 1, false),
('Café con Leche', 'Café tradicional con leche caliente', 3.00, 1, false),
('Té Verde', 'Té verde natural con propiedades antioxidantes', 2.00, 1, false),
('Chocolate Caliente', 'Chocolate cremoso con marshmallows', 3.50, 1, false),

-- Bebidas Frías
('Café Helado', 'Café frío con hielo y un toque de vainilla', 3.50, 2, true),
('Smoothie de Frutas', 'Batido natural de frutas de temporada', 4.50, 2, true),
('Limonada Natural', 'Limonada fresca con menta', 2.50, 2, false),
('Jugo de Naranja', 'Jugo natural recién exprimido', 3.00, 2, false),
('Agua Saborizada', 'Agua con sabores naturales', 2.00, 2, false),

-- Desayunos
('Tostadas Francesas', 'Pan brioche con canela, miel y frutas', 6.50, 3, true),
('Huevos Benedictinos', 'Huevos pochados sobre pan tostado con salsa holandesa', 8.50, 3, true),
('Pancakes', 'Esponjosos pancakes con jarabe de maple y mantequilla', 7.00, 3, false),
('Avena con Frutas', 'Avena cremosa con frutas frescas y granola', 5.50, 3, false),
('Croissant Relleno', 'Croissant artesanal con jamón y queso', 4.50, 3, false),

-- Almuerzos
('Ensalada César', 'Lechuga romana, crutones, parmesano y aderezo césar', 8.00, 4, true),
('Sandwich Club', 'Triple sandwich con pollo, tocino, lechuga y tomate', 9.50, 4, true),
('Pasta Alfredo', 'Fettuccine en salsa alfredo cremosa con pollo', 12.00, 4, false),
('Hamburguesa Gourmet', 'Carne angus con queso, cebolla caramelizada y papas', 11.50, 4, false),
('Sopa del Día', 'Sopa casera preparada diariamente', 6.00, 4, false),

-- Postres
('Cheesecake', 'Tarta de queso cremosa con base de galleta', 5.50, 5, true),
('Brownie con Helado', 'Brownie de chocolate caliente con helado de vainilla', 6.00, 5, true),
('Tiramisú', 'Postre italiano con café, mascarpone y cacao', 5.00, 5, false),
('Flan Casero', 'Flan tradicional con caramelo', 4.00, 5, false),
('Muffin del Día', 'Muffin recién horneado, sabor variable', 3.50, 5, false),

-- Snacks
('Nachos con Queso', 'Nachos crujientes con queso derretido y jalapeños', 6.50, 6, false),
('Alitas de Pollo', 'Alitas picantes con salsa ranch', 8.00, 6, false),
('Papas Fritas', 'Papas doradas y crujientes', 4.00, 6, false),
('Quesadilla', 'Tortilla con queso derretido y guacamole', 5.50, 6, false),
('Mix de Frutos Secos', 'Selección de nueces y frutas deshidratadas', 3.50, 6, false)
ON CONFLICT DO NOTHING;
