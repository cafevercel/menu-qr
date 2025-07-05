-- Verificar tablas existentes
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Verificar si existen las tablas de productos/categorías
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'products'
) as products_exists,
EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'categories'
) as categories_exists;
