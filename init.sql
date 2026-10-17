/*
============================================================
 PROYECTO FASE 2 - COMERCIAL LA ESTRELLA
 Base de Datos 1
 SQL Server 2022
============================================================
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET NUMERIC_ROUNDABORT OFF;
GO

-- =========================================================
-- 1. CREACIÓN DE BASE DE DATOS
-- =========================================================

IF DB_ID('COMERCIAL_LA_ESTRELLA') IS NULL
BEGIN
    CREATE DATABASE COMERCIAL_LA_ESTRELLA;
END;
GO

USE COMERCIAL_LA_ESTRELLA;
GO


-- =========================================================
-- 2. TABLAS CATÁLOGO Y GEOGRÁFICAS
-- =========================================================

-- ---------------------------------------------------------
-- PAIS
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.PAIS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PAIS (
        ID_PA INT NOT NULL,
        NOMBRE_PA VARCHAR(50) NOT NULL,

        CONSTRAINT PAIS_PK
            PRIMARY KEY (ID_PA),

        CONSTRAINT UK_PAIS_NOMBRE
            UNIQUE (NOMBRE_PA)
    );
END;
GO


-- ---------------------------------------------------------
-- TIPO_TIENDA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.TIPO_TIENDA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TIPO_TIENDA (
        ID_TIP_TIE INT NOT NULL,
        NOMBRE_TIP_TIE VARCHAR(50) NOT NULL,

        CONSTRAINT TIPO_TIENDA_PK
            PRIMARY KEY (ID_TIP_TIE),

        CONSTRAINT UK_TIPO_TIENDA_NOMBRE
            UNIQUE (NOMBRE_TIP_TIE)
    );
END;
GO


-- ---------------------------------------------------------
-- TIPO_IDENTIFICACION
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.TIPO_IDENTIFICACION', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TIPO_IDENTIFICACION (
        ID_TIP_IDE INT NOT NULL,
        NOMBRE_TIP_IDE VARCHAR(30) NOT NULL,

        CONSTRAINT TIPO_IDENTIFICACION_PK
            PRIMARY KEY (ID_TIP_IDE),

        CONSTRAINT UK_TIPO_IDENTIFICACION_NOMBRE
            UNIQUE (NOMBRE_TIP_IDE)
    );
END;
GO


-- ---------------------------------------------------------
-- CARGO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.CARGO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CARGO (
        ID_CAR INT NOT NULL,
        NOMBRE_CAR VARCHAR(50) NOT NULL,

        CONSTRAINT CARGO_PK
            PRIMARY KEY (ID_CAR),

        CONSTRAINT UK_CARGO_NOMBRE
            UNIQUE (NOMBRE_CAR)
    );
END;
GO


-- ---------------------------------------------------------
-- CATEGORIA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.CATEGORIA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CATEGORIA (
        ID_CAT INT NOT NULL,
        NOMBRE_CAT VARCHAR(50) NOT NULL,

        CONSTRAINT CATEGORIA_PK
            PRIMARY KEY (ID_CAT),

        CONSTRAINT UK_CATEGORIA_NOMBRE
            UNIQUE (NOMBRE_CAT)
    );
END;
GO


-- ---------------------------------------------------------
-- MARCA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.MARCA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MARCA (
        ID_MAR INT NOT NULL,
        NOMBRE_MAR VARCHAR(50) NOT NULL,

        CONSTRAINT MARCA_PK
            PRIMARY KEY (ID_MAR),

        CONSTRAINT UK_MARCA_NOMBRE
            UNIQUE (NOMBRE_MAR)
    );
END;
GO


-- ---------------------------------------------------------
-- ESTADO_VENTA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.ESTADO_VENTA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ESTADO_VENTA (
        ID_ES_VEN INT NOT NULL,
        NOMBRE_ES_VEN VARCHAR(30) NOT NULL,

        CONSTRAINT ESTADO_VENTA_PK
            PRIMARY KEY (ID_ES_VEN),

        CONSTRAINT UK_ESTADO_VENTA_NOMBRE
            UNIQUE (NOMBRE_ES_VEN)
    );
END;
GO


-- ---------------------------------------------------------
-- METODO_PAGO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.METODO_PAGO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.METODO_PAGO (
        ID_MET_PAG INT NOT NULL,
        NOMBRE_MET_PAG VARCHAR(50) NOT NULL,

        CONSTRAINT METODO_PAGO_PK
            PRIMARY KEY (ID_MET_PAG),

        CONSTRAINT UK_METODO_PAGO_NOMBRE
            UNIQUE (NOMBRE_MET_PAG)
    );
END;
GO


-- ---------------------------------------------------------
-- DEPARTAMENTO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.DEPARTAMENTO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.DEPARTAMENTO (
        ID_DEP INT NOT NULL,
        NOMBRE_DEP VARCHAR(50) NOT NULL,
        ID_PA INT NOT NULL,

        CONSTRAINT DEPARTAMENTO_PK
            PRIMARY KEY (ID_DEP),

        CONSTRAINT UK_DEPARTAMENTO_PAIS_NOMBRE
            UNIQUE (ID_PA, NOMBRE_DEP),

        CONSTRAINT DEPARTAMENTO_PAIS_FK
            FOREIGN KEY (ID_PA)
            REFERENCES dbo.PAIS(ID_PA)
    );
END;
GO


-- ---------------------------------------------------------
-- MUNICIPIO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.MUNICIPIO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MUNICIPIO (
        ID_MUN INT NOT NULL,
        NOMBRE_MUN VARCHAR(60) NOT NULL,
        ID_DEP INT NOT NULL,

        CONSTRAINT MUNICIPIO_PK
            PRIMARY KEY (ID_MUN),

        CONSTRAINT UK_MUNICIPIO_DEP_NOMBRE
            UNIQUE (ID_DEP, NOMBRE_MUN),

        CONSTRAINT MUNICIPIO_DEPARTAMENTO_FK
            FOREIGN KEY (ID_DEP)
            REFERENCES dbo.DEPARTAMENTO(ID_DEP)
    );
END;
GO


-- =========================================================
-- 3. PERSONAS Y TIENDAS
-- =========================================================

-- ---------------------------------------------------------
-- PERSONA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.PERSONA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PERSONA (
        ID_PER INT NOT NULL,
        NOMBRE_PER VARCHAR(50) NOT NULL,
        APELLIDO_PER VARCHAR(50) NOT NULL,
        TELEFONO VARCHAR(20) NOT NULL,
        CORREO_PER VARCHAR(100) NULL,
        DIRECCION_PER VARCHAR(150) NOT NULL,
        ID_MUN INT NOT NULL,

        CONSTRAINT PERSONA_PK
            PRIMARY KEY (ID_PER),

        CONSTRAINT PERSONA_MUNICIPIO_FK
            FOREIGN KEY (ID_MUN)
            REFERENCES dbo.MUNICIPIO(ID_MUN)
    );
END;
GO


-- En SQL Server una restricción UNIQUE normal permite solamente
-- un NULL. Para conservar el comportamiento que teníamos en Oracle,
-- usamos un índice UNIQUE filtrado.

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'UK_PERSONA_CORREO'
      AND object_id = OBJECT_ID('dbo.PERSONA')
)
BEGIN
    CREATE UNIQUE INDEX UK_PERSONA_CORREO
    ON dbo.PERSONA(CORREO_PER)
    WHERE CORREO_PER IS NOT NULL;
END;
GO


-- ---------------------------------------------------------
-- TIENDA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.TIENDA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TIENDA (
        ID_TI INT NOT NULL,
        NOMBRE_TI VARCHAR(80) NOT NULL,
        DIRECCION_TI VARCHAR(150) NOT NULL,
        TELEFONO_TI VARCHAR(20) NOT NULL,
        ID_TIP_TIE INT NOT NULL,
        ID_MUN INT NOT NULL,

        CONSTRAINT TIENDA_PK
            PRIMARY KEY (ID_TI),

        CONSTRAINT TIENDA_TIPO_TIENDA_FK
            FOREIGN KEY (ID_TIP_TIE)
            REFERENCES dbo.TIPO_TIENDA(ID_TIP_TIE),

        CONSTRAINT TIENDA_MUNICIPIO_FK
            FOREIGN KEY (ID_MUN)
            REFERENCES dbo.MUNICIPIO(ID_MUN)
    );
END;
GO


-- ---------------------------------------------------------
-- EMPLEADO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.EMPLEADO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.EMPLEADO (
        ID_EMP INT NOT NULL,
        FECHA_CONTRATACION DATE NOT NULL,
        ID_TI INT NOT NULL,
        ID_CAR INT NOT NULL,
        ID_PER INT NOT NULL,

        CONSTRAINT EMPLEADO_PK
            PRIMARY KEY (ID_EMP),

        CONSTRAINT UK_EMPLEADO_PERSONA
            UNIQUE (ID_PER),

        CONSTRAINT EMPLEADO_TIENDA_FK
            FOREIGN KEY (ID_TI)
            REFERENCES dbo.TIENDA(ID_TI),

        CONSTRAINT EMPLEADO_CARGO_FK
            FOREIGN KEY (ID_CAR)
            REFERENCES dbo.CARGO(ID_CAR),

        CONSTRAINT EMPLEADO_PERSONA_FK
            FOREIGN KEY (ID_PER)
            REFERENCES dbo.PERSONA(ID_PER)
    );
END;
GO


-- ---------------------------------------------------------
-- CLIENTE
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.CLIENTE', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLIENTE (
        ID_CLI INT NOT NULL,
        NUMERO_IDENTIFICACION VARCHAR(20) NOT NULL,
        ID_TIP_IDE INT NOT NULL,
        ID_PER INT NOT NULL,

        CONSTRAINT CLIENTE_PK
            PRIMARY KEY (ID_CLI),

        CONSTRAINT UK_CLIENTE_PERSONA
            UNIQUE (ID_PER),

        CONSTRAINT UK_CLIENTE_IDENTIFICACION
            UNIQUE (ID_TIP_IDE, NUMERO_IDENTIFICACION),

        CONSTRAINT CLIENTE_TIPO_IDENTIFICACION_FK
            FOREIGN KEY (ID_TIP_IDE)
            REFERENCES dbo.TIPO_IDENTIFICACION(ID_TIP_IDE),

        CONSTRAINT CLIENTE_PERSONA_FK
            FOREIGN KEY (ID_PER)
            REFERENCES dbo.PERSONA(ID_PER)
    );
END;
GO


-- =========================================================
-- 4. PRODUCTOS
-- =========================================================

-- ---------------------------------------------------------
-- PRODUCTO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.PRODUCTO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PRODUCTO (
        ID_PRO INT NOT NULL,
        NOMBRE_PRO VARCHAR(100) NOT NULL,
        DESCRIPCION_PRO VARCHAR(200) NOT NULL,
        ID_CAT INT NOT NULL,
        ID_MAR INT NOT NULL,

        CONSTRAINT PRODUCTO_PK
            PRIMARY KEY (ID_PRO),

        CONSTRAINT PRODUCTO_CATEGORIA_FK
            FOREIGN KEY (ID_CAT)
            REFERENCES dbo.CATEGORIA(ID_CAT),

        CONSTRAINT PRODUCTO_MARCA_FK
            FOREIGN KEY (ID_MAR)
            REFERENCES dbo.MARCA(ID_MAR)
    );
END;
GO


-- ---------------------------------------------------------
-- CATALOGO_PRODUCTO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.CATALOGO_PRODUCTO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CATALOGO_PRODUCTO (
        PRECIO_VIGENTE_CAT_PRO DECIMAL(10,2) NOT NULL,
        EXISTENCIA_ACTUAL_CAT_PRO INT NOT NULL,
        ID_TI INT NOT NULL,
        ID_PRO INT NOT NULL,

        CONSTRAINT CATALOGO_PRODUCTO_PK
            PRIMARY KEY (ID_TI, ID_PRO),

        CONSTRAINT CK_CATALOGO_PRECIO_POSITIVO
            CHECK (PRECIO_VIGENTE_CAT_PRO > 0),

        CONSTRAINT CK_CAT_EXISTENCIA_NO_NEG
            CHECK (EXISTENCIA_ACTUAL_CAT_PRO >= 0),

        CONSTRAINT CATALOGO_PRODUCTO_TIENDA_FK
            FOREIGN KEY (ID_TI)
            REFERENCES dbo.TIENDA(ID_TI),

        CONSTRAINT CATALOGO_PRODUCTO_PRODUCTO_FK
            FOREIGN KEY (ID_PRO)
            REFERENCES dbo.PRODUCTO(ID_PRO)
    );
END;
GO


-- =========================================================
-- 5. VENTAS
-- =========================================================

-- ---------------------------------------------------------
-- VENTA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.VENTA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.VENTA (
        ID_VEN INT NOT NULL,
        FECHA_VEN DATE NOT NULL,
        ID_TI INT NOT NULL,
        ID_EMP INT NOT NULL,
        ID_CLI INT NOT NULL,
        ID_ES_VEN INT NOT NULL,

        CONSTRAINT VENTA_PK
            PRIMARY KEY (ID_VEN),

        CONSTRAINT VENTA_TIENDA_FK
            FOREIGN KEY (ID_TI)
            REFERENCES dbo.TIENDA(ID_TI),

        CONSTRAINT VENTA_EMPLEADO_FK
            FOREIGN KEY (ID_EMP)
            REFERENCES dbo.EMPLEADO(ID_EMP),

        CONSTRAINT VENTA_CLIENTE_FK
            FOREIGN KEY (ID_CLI)
            REFERENCES dbo.CLIENTE(ID_CLI),

        CONSTRAINT VENTA_ESTADO_VENTA_FK
            FOREIGN KEY (ID_ES_VEN)
            REFERENCES dbo.ESTADO_VENTA(ID_ES_VEN)
    );
END;
GO


-- ---------------------------------------------------------
-- DESGLOSE_VENTA
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.DESGLOSE_VENTA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.DESGLOSE_VENTA (
        CANTIDAD_DES_VEN INT NOT NULL,
        PRECIO_UNITARIO_DES_VEN DECIMAL(10,2) NOT NULL,
        SUBTOTAL_DES_VEN DECIMAL(12,2) NOT NULL,
        ID_VEN INT NOT NULL,
        ID_PRO INT NOT NULL,

        CONSTRAINT DESGLOSE_VENTA_PK
            PRIMARY KEY (ID_VEN, ID_PRO),

        CONSTRAINT CK_DESGLOSE_CANTIDAD_POSITIVA
            CHECK (CANTIDAD_DES_VEN > 0),

        CONSTRAINT CK_DESGLOSE_PRECIO_POSITIVO
            CHECK (PRECIO_UNITARIO_DES_VEN > 0),

        CONSTRAINT CK_DESGLOSE_SUBTOTAL
            CHECK (
                SUBTOTAL_DES_VEN =
                CANTIDAD_DES_VEN * PRECIO_UNITARIO_DES_VEN
            ),

        CONSTRAINT DESGLOSE_VENTA_VENTA_FK
            FOREIGN KEY (ID_VEN)
            REFERENCES dbo.VENTA(ID_VEN),

        CONSTRAINT DESGLOSE_VENTA_PRODUCTO_FK
            FOREIGN KEY (ID_PRO)
            REFERENCES dbo.PRODUCTO(ID_PRO)
    );
END;
GO


-- ---------------------------------------------------------
-- PAGO
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.PAGO', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PAGO (
        ID_PAG INT NOT NULL,
        MONTO_PAG DECIMAL(12,2) NOT NULL,
        ID_MET_PAG INT NOT NULL,
        ID_VEN INT NOT NULL,

        CONSTRAINT PAGO_PK
            PRIMARY KEY (ID_PAG),

        CONSTRAINT CK_PAGO_MONTO_POSITIVO
            CHECK (MONTO_PAG > 0),

        CONSTRAINT PAGO_METODO_PAGO_FK
            FOREIGN KEY (ID_MET_PAG)
            REFERENCES dbo.METODO_PAGO(ID_MET_PAG),

        CONSTRAINT PAGO_VENTA_FK
            FOREIGN KEY (ID_VEN)
            REFERENCES dbo.VENTA(ID_VEN)
    );
END;
GO


-- =========================================================
-- 6. CONFIRMACIÓN
-- =========================================================

PRINT '=====================================================';
PRINT 'Base de datos COMERCIAL_LA_ESTRELLA inicializada.';
PRINT '19 tablas creadas correctamente.';
PRINT '=====================================================';
GO


-- =========================================================
-- 7. VISTAS ANALÍTICAS
-- =========================================================

-- ---------------------------------------------------------
-- VISTA 1: VENTAS POR TIENDA Y UBICACIÓN
-- ---------------------------------------------------------
CREATE OR ALTER VIEW dbo.Vista_Ventas_Ubicacion
AS
SELECT
    t.NOMBRE_TI AS tienda,
    m.NOMBRE_MUN AS municipio,
    d.NOMBRE_DEP AS departamento,
    p.NOMBRE_PA AS pais,
    COUNT(DISTINCT v.ID_VEN) AS cantidad_ventas,
    SUM(dv.SUBTOTAL_DES_VEN) AS total_facturado
FROM dbo.TIENDA t
INNER JOIN dbo.MUNICIPIO m
    ON t.ID_MUN = m.ID_MUN
INNER JOIN dbo.DEPARTAMENTO d
    ON m.ID_DEP = d.ID_DEP
INNER JOIN dbo.PAIS p
    ON d.ID_PA = p.ID_PA
INNER JOIN dbo.VENTA v
    ON v.ID_TI = t.ID_TI
INNER JOIN dbo.ESTADO_VENTA ev
    ON v.ID_ES_VEN = ev.ID_ES_VEN
INNER JOIN dbo.DESGLOSE_VENTA dv
    ON dv.ID_VEN = v.ID_VEN
WHERE ev.NOMBRE_ES_VEN <> 'ANULADA'
GROUP BY
    t.NOMBRE_TI,
    m.NOMBRE_MUN,
    d.NOMBRE_DEP,
    p.NOMBRE_PA;
GO


-- ---------------------------------------------------------
-- VISTA 2: PRODUCTOS MÁS VENDIDOS
-- ---------------------------------------------------------
CREATE OR ALTER VIEW dbo.Vista_Top_Productos
AS
SELECT
    p.ID_PRO AS codigo_producto,
    p.NOMBRE_PRO AS producto,
    c.NOMBRE_CAT AS categoria,
    m.NOMBRE_MAR AS marca,
    SUM(dv.CANTIDAD_DES_VEN) AS unidades_vendidas,
    SUM(dv.SUBTOTAL_DES_VEN) AS monto_generado
FROM dbo.DESGLOSE_VENTA dv
INNER JOIN dbo.PRODUCTO p
    ON dv.ID_PRO = p.ID_PRO
INNER JOIN dbo.CATEGORIA c
    ON p.ID_CAT = c.ID_CAT
INNER JOIN dbo.MARCA m
    ON p.ID_MAR = m.ID_MAR
INNER JOIN dbo.VENTA v
    ON dv.ID_VEN = v.ID_VEN
INNER JOIN dbo.ESTADO_VENTA ev
    ON v.ID_ES_VEN = ev.ID_ES_VEN
WHERE ev.NOMBRE_ES_VEN <> 'ANULADA'
GROUP BY
    p.ID_PRO,
    p.NOMBRE_PRO,
    c.NOMBRE_CAT,
    m.NOMBRE_MAR;
GO

-- ---------------------------------------------------------
-- VISTA 3: SALDOS PENDIENTES
-- ---------------------------------------------------------
CREATE OR ALTER VIEW dbo.Vista_Saldos_Pendientes
AS
WITH TOTAL_VENTA AS (
    SELECT
        ID_VEN,
        SUM(SUBTOTAL_DES_VEN) AS total_venta
    FROM dbo.DESGLOSE_VENTA
    GROUP BY ID_VEN
),
TOTAL_PAGO AS (
    SELECT
        ID_VEN,
        SUM(MONTO_PAG) AS total_pagado
    FROM dbo.PAGO
    GROUP BY ID_VEN
)
SELECT
    v.ID_VEN AS venta,
    tv.total_venta,
    ISNULL(tp.total_pagado, 0) AS total_pagado,
    tv.total_venta - ISNULL(tp.total_pagado, 0) AS saldo_pendiente
FROM dbo.VENTA v
INNER JOIN dbo.ESTADO_VENTA ev
    ON v.ID_ES_VEN = ev.ID_ES_VEN
INNER JOIN TOTAL_VENTA tv
    ON v.ID_VEN = tv.ID_VEN
LEFT JOIN TOTAL_PAGO tp
    ON v.ID_VEN = tp.ID_VEN
WHERE ev.NOMBRE_ES_VEN = 'REGISTRADA';
GO


-- =========================================================
-- 8. TRIGGERS
-- =========================================================

-- ---------------------------------------------------------
-- TRIGGER 1: PROTECCIÓN DE INVENTARIO
-- ---------------------------------------------------------
CREATE OR ALTER TRIGGER dbo.Insert_Detalle
ON dbo.DESGLOSE_VENTA
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar que exista suficiente stock
    IF EXISTS (
        SELECT 1
        FROM (
            SELECT
                v.ID_TI,
                i.ID_PRO,
                SUM(i.CANTIDAD_DES_VEN) AS CANTIDAD_SOLICITADA
            FROM inserted i
            INNER JOIN dbo.VENTA v
                ON v.ID_VEN = i.ID_VEN
            GROUP BY
                v.ID_TI,
                i.ID_PRO
        ) AS solicitud
        LEFT JOIN dbo.CATALOGO_PRODUCTO cp
            ON cp.ID_TI = solicitud.ID_TI
           AND cp.ID_PRO = solicitud.ID_PRO
        WHERE cp.ID_PRO IS NULL
           OR cp.EXISTENCIA_ACTUAL_CAT_PRO < solicitud.CANTIDAD_SOLICITADA
    )
    BEGIN
        THROW 50001, 'Stock insuficiente', 1;
    END;

    -- Descontar existencias
    UPDATE cp
    SET cp.EXISTENCIA_ACTUAL_CAT_PRO =
        cp.EXISTENCIA_ACTUAL_CAT_PRO - solicitud.CANTIDAD_SOLICITADA
    FROM dbo.CATALOGO_PRODUCTO cp
    INNER JOIN (
        SELECT
            v.ID_TI,
            i.ID_PRO,
            SUM(i.CANTIDAD_DES_VEN) AS CANTIDAD_SOLICITADA
        FROM inserted i
        INNER JOIN dbo.VENTA v
            ON v.ID_VEN = i.ID_VEN
        GROUP BY
            v.ID_TI,
            i.ID_PRO
    ) AS solicitud
        ON cp.ID_TI = solicitud.ID_TI
       AND cp.ID_PRO = solicitud.ID_PRO;
END;
GO


-- ---------------------------------------------------------
-- TRIGGER 2: ESTADO AUTOMÁTICO DE VENTA
-- ---------------------------------------------------------
CREATE OR ALTER TRIGGER dbo.Insert_Pago
ON dbo.PAGO
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    /*
        INSERTED contiene los pagos recién registrados.

        Solo se revisan las ventas afectadas
        por la operación actual.
    */

    ;WITH VENTAS_AFECTADAS AS (
        SELECT DISTINCT ID_VEN
        FROM inserted
    ),
    TOTAL_VENTA AS (
        SELECT
            dv.ID_VEN,
            SUM(dv.SUBTOTAL_DES_VEN) AS TOTAL_VENTA
        FROM dbo.DESGLOSE_VENTA dv
        INNER JOIN VENTAS_AFECTADAS va
            ON dv.ID_VEN = va.ID_VEN
        GROUP BY dv.ID_VEN
    ),
    TOTAL_PAGO AS (
        SELECT
            p.ID_VEN,
            SUM(p.MONTO_PAG) AS TOTAL_PAGADO
        FROM dbo.PAGO p
        INNER JOIN VENTAS_AFECTADAS va
            ON p.ID_VEN = va.ID_VEN
        GROUP BY p.ID_VEN
    )
    UPDATE v

    SET v.ID_ES_VEN = ev.ID_ES_VEN

    FROM dbo.VENTA v

    INNER JOIN TOTAL_VENTA tv
        ON v.ID_VEN = tv.ID_VEN

    INNER JOIN TOTAL_PAGO tp
        ON v.ID_VEN = tp.ID_VEN

    CROSS JOIN (
        SELECT ID_ES_VEN
        FROM dbo.ESTADO_VENTA
        WHERE NOMBRE_ES_VEN = 'PAGADA'
    ) ev

    WHERE tp.TOTAL_PAGADO >= tv.TOTAL_VENTA;
END;
GO