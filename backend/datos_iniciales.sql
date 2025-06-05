-- Insertar roles
INSERT INTO rol (id, nombre) VALUES
(1, 'Cliente'),
(2, 'Empleado'),
(3, 'Admin');

-- Insertar categorías
INSERT INTO categoria (id, precio, nombre) VALUES
(1, 28800, 'Apto discapacitados'),
(2, 34500, 'Chico'),
(3, 31800, 'Deportivo'),
(4, 39700, 'Mediano'),
(5, 35300, 'SUV'),
(6, 39600, 'Van');

-- Insertar estados de alquiler
INSERT INTO estado_alquiler (id, nombre) VALUES
(1, 'Confirmada'),
(2, 'Cancelada'),
(3, 'Finalizada');

-- Insertar estados de vehículo
INSERT INTO estado_vehiculo (id, nombre) VALUES
(1, 'Disponible'),
(2, 'Reservado'),
(3, 'Alquilado'),
(4, 'Fuera de Servicio');

-- Insertar localidades
INSERT INTO localidad (id, nombre) VALUES
(1, 'Azul'),
(2, 'Bahía Blanca'),
(3, 'Balcarce'),
(4, 'Campana'),
(5, 'Chivilcoy'),
(6, 'Junín'),
(7, 'La Plata'),
(8, 'Luján'),
(9, 'Mar del Plata'),
(10, 'Mercedes'),
(11, 'Necochea'),
(12, 'Olavarría'),
(13, 'Pergamino'),
(14, 'Pinamar'),
(15, 'San Nicolás'),
(16, 'San Pedro'),
(17, 'Tandil'),
(18, 'Tres Arroyos'),
(19, 'Villa Gesell'),
(20, 'Zárate');

-- Insertar marcas
INSERT INTO marca (id, nombre) VALUES
(1, 'Chevrolet'),
(2, 'Fiat'),
(3, 'Ford'),
(4, 'Honda'),
(5, 'Peugeot'),
(6, 'Renault'),
(7, 'Toyota'),
(8, 'Volkswagen');

-- Insertar modelos
INSERT INTO modelo (id, nombre) VALUES
(1, '2008'),
(2, '208'),
(3, '308'),
(4, 'Amarok'),
(5, 'Civic'),
(6, 'Corolla'),
(7, 'Cronos'),
(8, 'Cruze'),
(9, 'Duster'),
(10, 'EcoSport'),
(11, 'Etios'),
(12, 'Fiorino'),
(13, 'Fit'),
(14, 'Focus'),
(15, 'Gol'),
(16, 'HR-V'),
(17, 'Hilux'),
(18, 'Ka'),
(19, 'Kangoo'),
(20, 'Kwid'),
(21, 'Mobi'),
(22, 'Onix'),
(23, 'Partner'),
(24, 'Ranger'),
(25, 'Sandero'),
(26, 'Spin'),
(27, 'T-Cross'),
(28, 'Toro'),
(29, 'Tracker'),
(30, 'Virtus');

-- Insertar puestos
INSERT INTO puesto (id, nombre) VALUES
(1, 'Agente de Alquiler'),
(2, 'Supervisor de Sucursal'),
(3, 'Chofer de Traslado'),
(4, 'Lavador de Autos'),
(5, 'Mantenimiento'),
(6, 'Mecánico'),
(7, 'Inspector de Vehículos'),
(8, 'Encargado de Reclamos'),
(9, 'Contador'),
(10, 'Recursos Humanos'),
(11, 'Marketing'),
(12, 'Gerente de Flota');

-- Insertar usuarios administradores
INSERT INTO usuario (id, password, last_login, is_superuser, username, is_staff, is_active, date_joined, email, apellido, nombre, telefono, fecha_nacimiento, localidad_id, puesto, is_locked, last_login_attempt, login_attempts, admin_code_attempts, last_admin_code_attempt, rol_id) VALUES
(1,'pbkdf2_sha256$1000000$fUojEFfMIWLECy0ZI4BkZQ$/iLZwyGjTM63inU+fJYoAjnMTiPKo7xhH3UlWOiW3Qw=',NULL,0,'admin1@admin.com',0,1,'2025-05-27 23:37:09.764813','admin1@admin.com','Mario','admin1','1234567890','1990-01-01',NULL,NULL,0,NULL,0,0,NULL,3),
(2,'pbkdf2_sha256$1000000$UxmxRUK6skmABWvs8PFeiP$5mm+QofQ9g0O8JorrxunclY/zeJc4ApdoDqCuoCNkyk=',NULL,0,'admin2@admin.com',0,1,'2025-05-27 23:38:56.046102','admin2@admin.com','Maria','admin2','1234567890','1990-01-01',NULL,NULL,0,NULL,0,0,NULL,3); 