-- Atualiza registros existentes com uma imagem padrão
UPDATE "categories"
SET "image" = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d'
WHERE "image" IS NULL;