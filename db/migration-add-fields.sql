-- Idempotent migration: agrega nuevos campos a tabla productos existente
ALTER TABLE productos
    ADD COLUMN IF NOT EXISTS descripcion TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS categoria   TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS estado      TEXT NOT NULL DEFAULT 'activo';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'productos_estado_check'
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT productos_estado_check
            CHECK (estado IN ('activo', 'inactivo'));
    END IF;
END $$;
