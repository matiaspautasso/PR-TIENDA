CREATE TABLE IF NOT EXISTS productos (
    producto_id SERIAL PRIMARY KEY,
    nombre      TEXT    NOT NULL,
    descripcion TEXT    NOT NULL DEFAULT '',
    precio      NUMERIC NOT NULL CHECK (precio > 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria   TEXT    NOT NULL DEFAULT '',
    imagen      TEXT    NOT NULL DEFAULT '',
    estado      TEXT    NOT NULL DEFAULT 'activo'
                        CHECK (estado IN ('activo', 'inactivo'))
);
