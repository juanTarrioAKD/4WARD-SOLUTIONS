PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "django_migrations" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "applied" datetime NOT NULL);
INSERT INTO django_migrations VALUES(1,'contenttypes','0001_initial','2025-05-20 18:07:46.856601');
INSERT INTO django_migrations VALUES(2,'contenttypes','0002_remove_content_type_name','2025-05-20 18:07:46.864132');
INSERT INTO django_migrations VALUES(3,'auth','0001_initial','2025-05-20 18:07:46.876149');
INSERT INTO django_migrations VALUES(4,'auth','0002_alter_permission_name_max_length','2025-05-20 18:07:46.883942');
INSERT INTO django_migrations VALUES(5,'auth','0003_alter_user_email_max_length','2025-05-20 18:07:46.889050');
INSERT INTO django_migrations VALUES(6,'auth','0004_alter_user_username_opts','2025-05-20 18:07:46.894311');
INSERT INTO django_migrations VALUES(7,'auth','0005_alter_user_last_login_null','2025-05-20 18:07:46.900255');
INSERT INTO django_migrations VALUES(8,'auth','0006_require_contenttypes_0002','2025-05-20 18:07:46.904308');
INSERT INTO django_migrations VALUES(9,'auth','0007_alter_validators_add_error_messages','2025-05-20 18:07:46.910319');
INSERT INTO django_migrations VALUES(10,'auth','0008_alter_user_username_max_length','2025-05-20 18:07:46.915490');
INSERT INTO django_migrations VALUES(11,'auth','0009_alter_user_last_name_max_length','2025-05-20 18:07:46.923496');
INSERT INTO django_migrations VALUES(12,'auth','0010_alter_group_name_max_length','2025-05-20 18:07:46.930999');
INSERT INTO django_migrations VALUES(13,'auth','0011_update_proxy_permissions','2025-05-20 18:07:46.936730');
INSERT INTO django_migrations VALUES(14,'auth','0012_alter_user_first_name_max_length','2025-05-20 18:07:46.942197');
INSERT INTO django_migrations VALUES(15,'api','0001_initial','2025-05-20 18:07:46.991492');
INSERT INTO django_migrations VALUES(16,'admin','0001_initial','2025-05-20 18:07:47.006599');
INSERT INTO django_migrations VALUES(17,'admin','0002_logentry_remove_auto_add','2025-05-20 18:07:47.020714');
INSERT INTO django_migrations VALUES(18,'admin','0003_logentry_add_action_flag_choices','2025-05-20 18:07:47.028053');
INSERT INTO django_migrations VALUES(19,'sessions','0001_initial','2025-05-20 18:07:47.035287');
INSERT INTO django_migrations VALUES(20,'api','0002_remove_politicadecancelacion_tipo_and_more','2025-05-21 01:53:06.820919');
INSERT INTO django_migrations VALUES(21,'api','0003_alter_politicadecancelacion_descripcion_and_more','2025-05-21 01:55:29.364962');
INSERT INTO django_migrations VALUES(22,'api','0004_alter_sucursal_localidad','2025-05-21 04:15:52.401249');
INSERT INTO django_migrations VALUES(23,'api','0005_alquiler_cliente_alquiler_vehiculo_alter_usuario_rol','2025-05-23 01:55:16.106952');
INSERT INTO django_migrations VALUES(24,'api','0006_usuario_is_locked_usuario_last_login_attempt_and_more','2025-05-27 17:53:12.061124');
INSERT INTO django_migrations VALUES(25,'api','0007_rol_alter_usuario_rol','2025-05-27 18:01:56.570155');
INSERT INTO django_migrations VALUES(26,'api','0008_remove_usuario_first_name_remove_usuario_last_name','2025-05-27 18:20:05.611458');
INSERT INTO django_migrations VALUES(27,'api','0002_initial_estados','2025-05-28 00:42:54.308367');
INSERT INTO django_migrations VALUES(28,'api','0003_reset_sequences','2025-05-28 00:42:54.437340');
INSERT INTO django_migrations VALUES(29,'api','0009_merge_20250527_2142','2025-05-28 00:42:54.558141');
CREATE TABLE IF NOT EXISTS "django_content_type" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app_label" varchar(100) NOT NULL, "model" varchar(100) NOT NULL);
INSERT INTO django_content_type VALUES(1,'admin','logentry');
INSERT INTO django_content_type VALUES(2,'auth','permission');
INSERT INTO django_content_type VALUES(3,'auth','group');
INSERT INTO django_content_type VALUES(4,'contenttypes','contenttype');
INSERT INTO django_content_type VALUES(5,'sessions','session');
INSERT INTO django_content_type VALUES(6,'api','usuario');
INSERT INTO django_content_type VALUES(7,'api','puesto');
INSERT INTO django_content_type VALUES(8,'api','localidad');
INSERT INTO django_content_type VALUES(9,'api','estadoalquiler');
INSERT INTO django_content_type VALUES(10,'api','alquiler');
INSERT INTO django_content_type VALUES(11,'api','marca');
INSERT INTO django_content_type VALUES(12,'api','modelo');
INSERT INTO django_content_type VALUES(13,'api','estadovehiculo');
INSERT INTO django_content_type VALUES(14,'api','sucursal');
INSERT INTO django_content_type VALUES(15,'api','categoria');
INSERT INTO django_content_type VALUES(16,'api','politicadecancelacion');
INSERT INTO django_content_type VALUES(17,'api','vehiculo');
INSERT INTO django_content_type VALUES(18,'api','foto');
INSERT INTO django_content_type VALUES(19,'api','publicacion');
INSERT INTO django_content_type VALUES(20,'api','calificacion');
INSERT INTO django_content_type VALUES(21,'api','pregunta');
INSERT INTO django_content_type VALUES(22,'api','respuesta');
INSERT INTO django_content_type VALUES(23,'api','rol');
CREATE TABLE IF NOT EXISTS "auth_group_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "auth_permission" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "codename" varchar(100) NOT NULL, "name" varchar(255) NOT NULL);
INSERT INTO auth_permission VALUES(1,1,'add_logentry','Can add log entry');
INSERT INTO auth_permission VALUES(2,1,'change_logentry','Can change log entry');
INSERT INTO auth_permission VALUES(3,1,'delete_logentry','Can delete log entry');
INSERT INTO auth_permission VALUES(4,1,'view_logentry','Can view log entry');
INSERT INTO auth_permission VALUES(5,2,'add_permission','Can add permission');
INSERT INTO auth_permission VALUES(6,2,'change_permission','Can change permission');
INSERT INTO auth_permission VALUES(7,2,'delete_permission','Can delete permission');
INSERT INTO auth_permission VALUES(8,2,'view_permission','Can view permission');
INSERT INTO auth_permission VALUES(9,3,'add_group','Can add group');
INSERT INTO auth_permission VALUES(10,3,'change_group','Can change group');
INSERT INTO auth_permission VALUES(11,3,'delete_group','Can delete group');
INSERT INTO auth_permission VALUES(12,3,'view_group','Can view group');
INSERT INTO auth_permission VALUES(13,4,'add_contenttype','Can add content type');
INSERT INTO auth_permission VALUES(14,4,'change_contenttype','Can change content type');
INSERT INTO auth_permission VALUES(15,4,'delete_contenttype','Can delete content type');
INSERT INTO auth_permission VALUES(16,4,'view_contenttype','Can view content type');
INSERT INTO auth_permission VALUES(17,5,'add_session','Can add session');
INSERT INTO auth_permission VALUES(18,5,'change_session','Can change session');
INSERT INTO auth_permission VALUES(19,5,'delete_session','Can delete session');
INSERT INTO auth_permission VALUES(20,5,'view_session','Can view session');
INSERT INTO auth_permission VALUES(21,6,'add_usuario','Can add usuario');
INSERT INTO auth_permission VALUES(22,6,'change_usuario','Can change usuario');
INSERT INTO auth_permission VALUES(23,6,'delete_usuario','Can delete usuario');
INSERT INTO auth_permission VALUES(24,6,'view_usuario','Can view usuario');
INSERT INTO auth_permission VALUES(25,7,'add_puesto','Can add puesto');
INSERT INTO auth_permission VALUES(26,7,'change_puesto','Can change puesto');
INSERT INTO auth_permission VALUES(27,7,'delete_puesto','Can delete puesto');
INSERT INTO auth_permission VALUES(28,7,'view_puesto','Can view puesto');
INSERT INTO auth_permission VALUES(29,8,'add_localidad','Can add localidad');
INSERT INTO auth_permission VALUES(30,8,'change_localidad','Can change localidad');
INSERT INTO auth_permission VALUES(31,8,'delete_localidad','Can delete localidad');
INSERT INTO auth_permission VALUES(32,8,'view_localidad','Can view localidad');
INSERT INTO auth_permission VALUES(33,9,'add_estadoalquiler','Can add estado alquiler');
INSERT INTO auth_permission VALUES(34,9,'change_estadoalquiler','Can change estado alquiler');
INSERT INTO auth_permission VALUES(35,9,'delete_estadoalquiler','Can delete estado alquiler');
INSERT INTO auth_permission VALUES(36,9,'view_estadoalquiler','Can view estado alquiler');
INSERT INTO auth_permission VALUES(37,10,'add_alquiler','Can add alquiler');
INSERT INTO auth_permission VALUES(38,10,'change_alquiler','Can change alquiler');
INSERT INTO auth_permission VALUES(39,10,'delete_alquiler','Can delete alquiler');
INSERT INTO auth_permission VALUES(40,10,'view_alquiler','Can view alquiler');
INSERT INTO auth_permission VALUES(41,11,'add_marca','Can add marca');
INSERT INTO auth_permission VALUES(42,11,'change_marca','Can change marca');
INSERT INTO auth_permission VALUES(43,11,'delete_marca','Can delete marca');
INSERT INTO auth_permission VALUES(44,11,'view_marca','Can view marca');
INSERT INTO auth_permission VALUES(45,12,'add_modelo','Can add modelo');
INSERT INTO auth_permission VALUES(46,12,'change_modelo','Can change modelo');
INSERT INTO auth_permission VALUES(47,12,'delete_modelo','Can delete modelo');
INSERT INTO auth_permission VALUES(48,12,'view_modelo','Can view modelo');
INSERT INTO auth_permission VALUES(49,13,'add_estadovehiculo','Can add estado vehiculo');
INSERT INTO auth_permission VALUES(50,13,'change_estadovehiculo','Can change estado vehiculo');
INSERT INTO auth_permission VALUES(51,13,'delete_estadovehiculo','Can delete estado vehiculo');
INSERT INTO auth_permission VALUES(52,13,'view_estadovehiculo','Can view estado vehiculo');
INSERT INTO auth_permission VALUES(53,14,'add_sucursal','Can add sucursal');
INSERT INTO auth_permission VALUES(54,14,'change_sucursal','Can change sucursal');
INSERT INTO auth_permission VALUES(55,14,'delete_sucursal','Can delete sucursal');
INSERT INTO auth_permission VALUES(56,14,'view_sucursal','Can view sucursal');
INSERT INTO auth_permission VALUES(57,15,'add_categoria','Can add categoria');
INSERT INTO auth_permission VALUES(58,15,'change_categoria','Can change categoria');
INSERT INTO auth_permission VALUES(59,15,'delete_categoria','Can delete categoria');
INSERT INTO auth_permission VALUES(60,15,'view_categoria','Can view categoria');
INSERT INTO auth_permission VALUES(61,16,'add_politicadecancelacion','Can add politica de cancelacion');
INSERT INTO auth_permission VALUES(62,16,'change_politicadecancelacion','Can change politica de cancelacion');
INSERT INTO auth_permission VALUES(63,16,'delete_politicadecancelacion','Can delete politica de cancelacion');
INSERT INTO auth_permission VALUES(64,16,'view_politicadecancelacion','Can view politica de cancelacion');
INSERT INTO auth_permission VALUES(65,17,'add_vehiculo','Can add vehiculo');
INSERT INTO auth_permission VALUES(66,17,'change_vehiculo','Can change vehiculo');
INSERT INTO auth_permission VALUES(67,17,'delete_vehiculo','Can delete vehiculo');
INSERT INTO auth_permission VALUES(68,17,'view_vehiculo','Can view vehiculo');
INSERT INTO auth_permission VALUES(69,18,'add_foto','Can add foto');
INSERT INTO auth_permission VALUES(70,18,'change_foto','Can change foto');
INSERT INTO auth_permission VALUES(71,18,'delete_foto','Can delete foto');
INSERT INTO auth_permission VALUES(72,18,'view_foto','Can view foto');
INSERT INTO auth_permission VALUES(73,19,'add_publicacion','Can add publicacion');
INSERT INTO auth_permission VALUES(74,19,'change_publicacion','Can change publicacion');
INSERT INTO auth_permission VALUES(75,19,'delete_publicacion','Can delete publicacion');
INSERT INTO auth_permission VALUES(76,19,'view_publicacion','Can view publicacion');
INSERT INTO auth_permission VALUES(77,20,'add_calificacion','Can add calificacion');
INSERT INTO auth_permission VALUES(78,20,'change_calificacion','Can change calificacion');
INSERT INTO auth_permission VALUES(79,20,'delete_calificacion','Can delete calificacion');
INSERT INTO auth_permission VALUES(80,20,'view_calificacion','Can view calificacion');
INSERT INTO auth_permission VALUES(81,21,'add_pregunta','Can add pregunta');
INSERT INTO auth_permission VALUES(82,21,'change_pregunta','Can change pregunta');
INSERT INTO auth_permission VALUES(83,21,'delete_pregunta','Can delete pregunta');
INSERT INTO auth_permission VALUES(84,21,'view_pregunta','Can view pregunta');
INSERT INTO auth_permission VALUES(85,22,'add_respuesta','Can add respuesta');
INSERT INTO auth_permission VALUES(86,22,'change_respuesta','Can change respuesta');
INSERT INTO auth_permission VALUES(87,22,'delete_respuesta','Can delete respuesta');
INSERT INTO auth_permission VALUES(88,22,'view_respuesta','Can view respuesta');
INSERT INTO auth_permission VALUES(89,23,'add_rol','Can add rol');
INSERT INTO auth_permission VALUES(90,23,'change_rol','Can change rol');
INSERT INTO auth_permission VALUES(91,23,'delete_rol','Can delete rol');
INSERT INTO auth_permission VALUES(92,23,'view_rol','Can view rol');
CREATE TABLE IF NOT EXISTS "auth_group" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(150) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS "categoria" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "precio" decimal NOT NULL, "nombre" TEXT NOT NULL);
INSERT INTO categoria (id, precio, nombre) VALUES
(1, 28800, 'Apto discapacitados'),
(2, 34500, 'Chico'),
(3, 31800, 'Deportivo'),
(4, 39700, 'Mediano'),
(5, 35300, 'SUV'),
(6, 39600, 'Van');
CREATE TABLE IF NOT EXISTS "estado_alquiler" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL);
INSERT INTO estado_alquiler (id, nombre) VALUES
(1, 'Pendiente'),
(2, 'Confirmada'),
(3, 'Cancelada'),
(4, 'Finalizada'),
(5, 'Finalizada con retraso');
CREATE TABLE IF NOT EXISTS "estado_vehiculo" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL);
INSERT INTO estado_vehiculo (id, nombre) VALUES
(1, 'Disponible'),
(2, 'Reservado'),
(3, 'Alquilado'),
(4, 'Fuera de Servicio');
CREATE TABLE IF NOT EXISTS "localidad" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL);
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
CREATE TABLE IF NOT EXISTS "marca" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL);
INSERT INTO marca (id, nombre) VALUES
(1, 'Chevrolet'),
(2, 'Fiat'),
(3, 'Ford'),
(4, 'Honda'),
(5, 'Peugeot'),
(6, 'Renault'),
(7, 'Toyota'),
(8, 'Volkswagen');
CREATE TABLE IF NOT EXISTS "modelo" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL);
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
CREATE TABLE IF NOT EXISTS "puesto" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL);
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
CREATE TABLE IF NOT EXISTS "usuario_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "usuario_id" bigint NOT NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "usuario_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "usuario_id" bigint NOT NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "publicacion" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "fecha_creacion" datetime NOT NULL, "categoria_id" bigint NOT NULL REFERENCES "categoria" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "pregunta" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "comentario" text NOT NULL, "ID_Usuario" bigint NOT NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED, "ID_Publi" bigint NOT NULL REFERENCES "publicacion" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "calificacion" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "puntaje" integer NOT NULL, "ID_Usuario" bigint NOT NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED, "ID_Publi" bigint NOT NULL REFERENCES "publicacion" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "respuesta" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "comentario" text NOT NULL, "ID_Usuario" bigint NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "vehiculo" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "patente" varchar(20) NOT NULL UNIQUE, "capacidad" integer NOT NULL, "año_fabricacion" integer NOT NULL, "ID_Cate" bigint NOT NULL REFERENCES "categoria" ("id") DEFERRABLE INITIALLY DEFERRED, "ID_EstVehi" bigint NOT NULL REFERENCES "estado_vehiculo" ("id") DEFERRABLE INITIALLY DEFERRED, "ID_Marca" bigint NOT NULL REFERENCES "marca" ("id") DEFERRABLE INITIALLY DEFERRED, "ID_Politica" bigint NOT NULL REFERENCES "politica_de_cancelacion" ("id") DEFERRABLE INITIALLY DEFERRED, "ID_Sucursal" bigint NOT NULL REFERENCES "sucursal" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB444BI', 5, 2019, 4, 1, 2, 2, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC753CF', 5, 2019, 6, 1, 4, 2, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF972DO', 5, 2018, 2, 1, 7, 3, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB490AM', 5, 2018, 4, 1, 1, 2, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG558BH', 5, 2016, 2, 1, 6, 1, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB833BD', 5, 2016, 6, 1, 4, 1, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD783VH', 5, 2016, 2, 1, 7, 2, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB807GM', 5, 2015, 6, 1, 4, 2, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE313SH', 5, 2017, 2, 1, 4, 3, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA905FR', 5, 2017, 6, 1, 4, 3, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF687AB', 5, 2017, 5, 1, 5, 1, 12);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG755FV', 5, 2020, 2, 1, 3, 3, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB315SI', 5, 2016, 3, 1, 2, 3, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD347GV', 5, 2023, 2, 1, 4, 3, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD461DR', 5, 2015, 2, 1, 4, 2, 3);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF128RB', 5, 2018, 3, 1, 3, 2, 8);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA866NM', 5, 2015, 6, 1, 4, 3, 12);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF542KX', 2, 2019, 4, 1, 2, 2, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD558KF', 5, 2019, 5, 1, 5, 2, 8);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD212DG', 5, 2016, 4, 1, 8, 2, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG964QF', 5, 2021, 4, 1, 8, 1, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE480DV', 5, 2021, 5, 1, 6, 2, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB258VP', 5, 2015, 2, 1, 3, 1, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB271JJ', 5, 2018, 2, 1, 8, 1, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE479PJ', 5, 2016, 3, 1, 7, 2, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC914WH', 5, 2022, 2, 1, 1, 3, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG694PM', 5, 2018, 5, 1, 5, 1, 6);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC935IE', 5, 2018, 2, 1, 8, 3, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF941IE', 5, 2016, 2, 1, 7, 3, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE653CK', 5, 2016, 5, 1, 5, 3, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB898XM', 5, 2016, 2, 1, 7, 1, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA169YM', 5, 2019, 3, 1, 3, 2, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB828SN', 5, 2018, 2, 1, 8, 1, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF185FA', 5, 2017, 6, 1, 5, 1, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF754EV', 5, 2018, 3, 1, 8, 2, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA400RQ', 5, 2021, 2, 1, 6, 1, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE761WP', 5, 2021, 2, 1, 3, 2, 8);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE683IK', 5, 2021, 2, 1, 8, 3, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF717MZ', 5, 2022, 1, 1, 3, 3, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF501GH', 5, 2023, 2, 1, 4, 3, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE821PJ', 5, 2022, 2, 1, 1, 3, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB576XX', 5, 2022, 2, 1, 7, 1, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE853IP', 5, 2016, 2, 1, 4, 1, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC596HC', 5, 2019, 5, 1, 5, 3, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA305ZK', 7, 2022, 1, 1, 1, 3, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD441KX', 5, 2015, 4, 1, 1, 1, 15);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE482EQ', 5, 2021, 3, 1, 2, 2, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE369NM', 5, 2017, 3, 1, 3, 2, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC663SU', 5, 2015, 6, 1, 5, 1, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE729RV', 5, 2018, 6, 1, 4, 1, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD570UL', 5, 2017, 4, 1, 7, 1, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG392TF', 5, 2022, 5, 1, 5, 2, 15);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC496LJ', 5, 2021, 6, 1, 5, 1, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG966IY', 5, 2021, 4, 1, 3, 3, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD430TO', 5, 2021, 4, 1, 7, 2, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC638WD', 5, 2022, 3, 1, 8, 1, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE698GA', 5, 2021, 6, 1, 4, 2, 3);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF194AV', 5, 2021, 2, 1, 8, 1, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD282HI', 5, 2022, 2, 1, 4, 1, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD381KQ', 5, 2021, 2, 1, 6, 1, 8);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC245NA', 5, 2018, 2, 1, 8, 1, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF646WE', 5, 2017, 2, 1, 6, 2, 3);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC733UD', 2, 2020, 4, 1, 2, 1, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE547YJ', 5, 2021, 6, 1, 4, 1, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA631ZO', 5, 2019, 5, 1, 5, 2, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA101QJ', 5, 2023, 6, 1, 8, 3, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF770TZ', 5, 2022, 3, 1, 7, 1, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE410NA', 5, 2018, 6, 1, 4, 2, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE619HG', 5, 2015, 2, 1, 6, 3, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE734BS', 5, 2015, 3, 1, 8, 3, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB585PL', 5, 2022, 2, 1, 8, 2, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD547YS', 5, 2023, 4, 1, 2, 2, 6);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD266XK', 5, 2017, 4, 1, 3, 2, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA863YU', 5, 2015, 5, 1, 5, 2, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD611RZ', 5, 2016, 4, 1, 7, 1, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB953UA', 5, 2023, 2, 1, 7, 2, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB529QN', 5, 2019, 4, 1, 3, 3, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD256DV', 5, 2022, 5, 1, 5, 2, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB982SX', 5, 2017, 2, 1, 4, 2, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC147RP', 5, 2015, 5, 1, 5, 3, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC309XK', 5, 2015, 1, 1, 1, 3, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG186BT', 2, 2018, 4, 1, 2, 2, 8);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB538JO', 2, 2015, 4, 1, 2, 3, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD663XQ', 5, 2020, 3, 1, 2, 2, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD654UF', 5, 2019, 2, 1, 6, 3, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG648EX', 5, 2018, 4, 1, 1, 3, 7);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF867NH', 5, 2019, 3, 1, 7, 3, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD813UH', 5, 2015, 3, 1, 7, 3, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF978OE', 5, 2016, 1, 1, 3, 1, 15);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF637OO', 5, 2018, 4, 1, 3, 2, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB922NQ', 5, 2023, 3, 1, 3, 1, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB846WC', 2, 2019, 4, 1, 2, 1, 12);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD619WJ', 5, 2021, 3, 1, 8, 1, 15);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD449XS', 5, 2019, 5, 1, 5, 2, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG125SQ', 7, 2021, 1, 1, 1, 1, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF741PA', 5, 2019, 2, 1, 1, 2, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB840OW', 5, 2020, 2, 1, 6, 3, 12);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD114SE', 5, 2016, 2, 1, 2, 2, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE479OS', 5, 2017, 2, 1, 6, 1, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE747RQ', 5, 2015, 2, 1, 3, 3, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD812ZX', 5, 2017, 2, 1, 6, 1, 6);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA173UX', 5, 2016, 4, 1, 7, 1, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF285CW', 2, 2018, 4, 1, 2, 3, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA756PQ', 5, 2018, 2, 1, 7, 3, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD884JO', 5, 2017, 2, 1, 8, 3, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC419CZ', 5, 2018, 6, 1, 5, 3, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB346EK', 5, 2017, 5, 1, 5, 3, 3);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC246NB', 5, 2015, 3, 1, 3, 3, 7);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA525BP', 2, 2019, 4, 1, 2, 3, 15);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD170GK', 5, 2016, 2, 1, 4, 2, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG260SM', 5, 2022, 3, 1, 3, 3, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB204LY', 5, 2015, 3, 1, 3, 3, 16);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG639CJ', 5, 2018, 4, 1, 8, 1, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF341DX', 5, 2023, 6, 1, 4, 2, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA900BN', 5, 2023, 1, 1, 1, 1, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE123CT', 5, 2020, 4, 1, 1, 3, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD994LT', 2, 2020, 4, 1, 2, 3, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF788VA', 5, 2023, 3, 1, 7, 1, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA439IM', 5, 2021, 2, 1, 6, 2, 8);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC949MS', 5, 2017, 4, 1, 7, 3, 14);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE568ZI', 5, 2018, 6, 1, 4, 2, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA960CA', 7, 2023, 1, 1, 1, 3, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD948MN', 7, 2018, 1, 1, 1, 3, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG345OT', 5, 2020, 5, 1, 5, 1, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC778DU', 5, 2015, 2, 1, 2, 1, 20);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE694FM', 5, 2015, 4, 1, 2, 2, 10);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE430DM', 5, 2019, 4, 1, 7, 2, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA835NK', 5, 2021, 6, 1, 4, 3, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA619TF', 5, 2015, 2, 1, 2, 3, 7);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA117ZY', 5, 2019, 4, 1, 2, 3, 13);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB757ZT', 5, 2018, 6, 1, 5, 2, 7);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE686SD', 5, 2019, 1, 1, 3, 3, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE368OB', 5, 2015, 3, 1, 8, 1, 12);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB651DS', 5, 2017, 6, 1, 5, 3, 6);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD718RG', 5, 2019, 3, 1, 2, 2, 3);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB178IO', 5, 2016, 3, 1, 7, 3, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC376NL', 5, 2022, 2, 1, 4, 3, 3);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF608CB', 5, 2015, 5, 1, 5, 3, 1);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD564UV', 5, 2017, 2, 1, 1, 2, 18);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AA509HE', 5, 2015, 1, 1, 3, 1, 5);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG787TA', 5, 2020, 5, 1, 6, 1, 2);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AD745CL', 5, 2022, 6, 1, 4, 2, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG156PJ', 5, 2017, 6, 1, 4, 3, 9);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC585VW', 5, 2023, 2, 1, 6, 1, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AF514RZ', 5, 2019, 6, 1, 4, 3, 12);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AB879ZF', 5, 2023, 2, 1, 3, 1, 17);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE742OI', 5, 2015, 3, 1, 3, 2, 4);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AE881AL', 5, 2023, 2, 1, 8, 2, 11);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AG926EV', 5, 2021, 5, 1, 5, 2, 19);
INSERT INTO vehiculo (patente, capacidad, año_fabricacion, ID_Cate, ID_EstVehi, ID_Marca, ID_Politica, ID_Sucursal) VALUES ('AC226VV', 5, 2018, 4, 1, 2, 3, 11);
CREATE TABLE IF NOT EXISTS "foto" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "imagen" varchar(100) NOT NULL, "ID_Vehi" bigint NOT NULL REFERENCES "vehiculo" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "django_admin_log" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "object_id" text NULL, "object_repr" varchar(200) NOT NULL, "action_flag" smallint unsigned NOT NULL CHECK ("action_flag" >= 0), "change_message" text NOT NULL, "content_type_id" integer NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" bigint NOT NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED, "action_time" datetime NOT NULL);
CREATE TABLE IF NOT EXISTS "django_session" ("session_key" varchar(40) NOT NULL PRIMARY KEY, "session_data" text NOT NULL, "expire_date" datetime NOT NULL);
CREATE TABLE IF NOT EXISTS "politica_de_cancelacion" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "porcentaje" decimal NOT NULL, "descripcion" text NOT NULL, "nombre" varchar(100) NOT NULL);
INSERT INTO politica_de_cancelacion (id, porcentaje, descripcion, nombre) VALUES
(1, 100.0, 'Reembolso completo si se cancela con anticipación', '100% de devolución'),
(2, 20.0, 'Reembolso parcial, se retiene el 80%', '20% de devolución'),
(3, 0.0, 'No hay reembolso en esta política', 'Sin devolución');
CREATE TABLE IF NOT EXISTS "sucursal" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(100) NOT NULL, "telefono" varchar(20) NOT NULL, "direccion" varchar(200) NOT NULL, "ID_Localidad" bigint NOT NULL REFERENCES "localidad" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO sucursal (id, nombre, telefono, direccion, ID_Localidad) VALUES
( 1, 'Sucursal Azul', '0001-4123401', 'Calle Falsa 101', 1),
( 2, 'Sucursal Bahía Blanca', '0002-4123402', 'Calle Falsa 102', 2),
( 3, 'Sucursal Balcarce', '0003-4123403', 'Calle Falsa 103', 3),
( 4, 'Sucursal Campana', '0004-4123404', 'Calle Falsa 104', 4),
( 5, 'Sucursal Chivilcoy', '0005-4123405', 'Calle Falsa 105', 5),
( 6, 'Sucursal Junín', '0006-4123406', 'Calle Falsa 106', 6),
( 7, 'Sucursal La Plata', '0007-4123407', 'Calle Falsa 107', 7),
( 8, 'Sucursal Luján', '0008-4123408', 'Calle Falsa 108', 8),
( 9, 'Sucursal Mar del Plata', '0009-4123409', 'Calle Falsa 109', 9),
(10, 'Sucursal Mercedes', '0010-4123410', 'Calle Falsa 110', 10),
(11, 'Sucursal Necochea', '0011-4123411', 'Calle Falsa 111', 11),
(12, 'Sucursal Olavarría', '0012-4123412', 'Calle Falsa 112', 12),
(13, 'Sucursal Pergamino', '0013-4123413', 'Calle Falsa 113', 13),
(14, 'Sucursal Pinamar', '0014-4123414', 'Calle Falsa 114', 14),
(15, 'Sucursal San Nicolás', '0015-4123415', 'Calle Falsa 115', 15),
(16, 'Sucursal San Pedro', '0016-4123416', 'Calle Falsa 116', 16),
(17, 'Sucursal Tandil', '0017-4123417', 'Calle Falsa 117', 17),
(18, 'Sucursal Tres Arroyos', '0018-4123418', 'Calle Falsa 118', 18),
(19, 'Sucursal Villa Gesell', '0019-4123419', 'Calle Falsa 119', 19),
(20, 'Sucursal Zárate', '0020-4123420', 'Calle Falsa 120', 20);
CREATE TABLE IF NOT EXISTS "alquiler" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "fecha_inicio" datetime NOT NULL, "fecha_fin" datetime NOT NULL, "fecha_reserva" datetime NOT NULL, "monto_total" decimal NOT NULL, "IDEstado" bigint NOT NULL REFERENCES "estado_alquiler" ("id") DEFERRABLE INITIALLY DEFERRED, "vehiculo_id" bigint NULL REFERENCES "vehiculo" ("id") DEFERRABLE INITIALLY DEFERRED, "cliente_id" bigint NOT NULL REFERENCES "usuario" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE TABLE IF NOT EXISTS "rol" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nombre" varchar(20) NOT NULL UNIQUE);
INSERT INTO rol (id, nombre) VALUES
(1, 'Cliente'),
(2, 'Empleado'),
(3, 'Admin');
CREATE TABLE IF NOT EXISTS "usuario" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "password" varchar(128) NOT NULL, "last_login" datetime NULL, "is_superuser" bool NOT NULL, "username" varchar(150) NOT NULL UNIQUE, "is_staff" bool NOT NULL, "is_active" bool NOT NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "apellido" varchar(100) NOT NULL, "nombre" varchar(100) NOT NULL, "telefono" varchar(20) NOT NULL, "fecha_nacimiento" date NOT NULL, "localidad_id" bigint NULL REFERENCES "localidad" ("id") DEFERRABLE INITIALLY DEFERRED, "puesto" varchar(100) NULL, "is_locked" bool NOT NULL, "last_login_attempt" datetime NULL, "login_attempts" integer NOT NULL, "rol_id" bigint NOT NULL REFERENCES "rol" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO usuario VALUES(1,'pbkdf2_sha256$1000000$fUojEFfMIWLECy0ZI4BkZQ$/iLZwyGjTM63inU+fJYoAjnMTiPKo7xhH3UlWOiW3Qw=',NULL,0,'admin1@admin.com',0,1,'2025-05-27 23:37:09.764813','admin1@admin.com','Mario','admin1','1234567890','1990-01-01',NULL,NULL,0,NULL,0,3);
INSERT INTO usuario VALUES(2,'pbkdf2_sha256$1000000$UxmxRUK6skmABWvs8PFeiP$5mm+QofQ9g0O8JorrxunclY/zeJc4ApdoDqCuoCNkyk=',NULL,0,'admin2@admin.com',0,1,'2025-05-27 23:38:56.046102','admin2@admin.com','Maria','admin2','1234567890','1990-01-01',NULL,NULL,0,NULL,0,3);
INSERT INTO sqlite_sequence VALUES('django_migrations',29);
INSERT INTO sqlite_sequence VALUES('django_content_type',23);
INSERT INTO sqlite_sequence VALUES('auth_permission',92);
INSERT INTO sqlite_sequence VALUES('auth_group',0);
INSERT INTO sqlite_sequence VALUES('django_admin_log',0);
INSERT INTO sqlite_sequence VALUES('politica_de_cancelacion',0);
INSERT INTO sqlite_sequence VALUES('marca',0);
INSERT INTO sqlite_sequence VALUES('categoria',0);
INSERT INTO sqlite_sequence VALUES('estado_vehiculo',0);
INSERT INTO sqlite_sequence VALUES('vehiculo',0);
INSERT INTO sqlite_sequence VALUES('publicacion',0);
INSERT INTO sqlite_sequence VALUES('calificacion',0);
INSERT INTO sqlite_sequence VALUES('pregunta',0);
INSERT INTO sqlite_sequence VALUES('localidad',0);
INSERT INTO sqlite_sequence VALUES('sucursal',0);
INSERT INTO sqlite_sequence VALUES('estado_alquiler',4);
INSERT INTO sqlite_sequence VALUES('alquiler',0);
INSERT INTO sqlite_sequence VALUES('usuario',2);
INSERT INTO sqlite_sequence VALUES('rol',3);
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type" ("app_label", "model");
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions" ("group_id", "permission_id");
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions" ("group_id");
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions" ("permission_id");
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission" ("content_type_id", "codename");
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "auth_permission" ("content_type_id");
CREATE UNIQUE INDEX "usuario_groups_usuario_id_group_id_2e3cd638_uniq" ON "usuario_groups" ("usuario_id", "group_id");
CREATE INDEX "usuario_groups_usuario_id_161fc80c" ON "usuario_groups" ("usuario_id");
CREATE INDEX "usuario_groups_group_id_c67c8651" ON "usuario_groups" ("group_id");
CREATE UNIQUE INDEX "usuario_user_permissions_usuario_id_permission_id_3db58b8c_uniq" ON "usuario_user_permissions" ("usuario_id", "permission_id");
CREATE INDEX "usuario_user_permissions_usuario_id_693d9c50" ON "usuario_user_permissions" ("usuario_id");
CREATE INDEX "usuario_user_permissions_permission_id_a8893ce7" ON "usuario_user_permissions" ("permission_id");
CREATE INDEX "publicacion_categoria_id_90b47ad9" ON "publicacion" ("categoria_id");
CREATE INDEX "pregunta_ID_Usuario_c332aace" ON "pregunta" ("ID_Usuario");
CREATE INDEX "pregunta_ID_Publi_943ab684" ON "pregunta" ("ID_Publi");
CREATE INDEX "calificacion_ID_Usuario_1512dcfb" ON "calificacion" ("ID_Usuario");
CREATE INDEX "calificacion_ID_Publi_6c8a1206" ON "calificacion" ("ID_Publi");
CREATE INDEX "respuesta_ID_Usuario_42ced89a" ON "respuesta" ("ID_Usuario");
CREATE INDEX "vehiculo_ID_Cate_7aed13b1" ON "vehiculo" ("ID_Cate");
CREATE INDEX "vehiculo_ID_EstVehi_5ee049d0" ON "vehiculo" ("ID_EstVehi");
CREATE INDEX "vehiculo_ID_Marca_9e529478" ON "vehiculo" ("ID_Marca");
CREATE INDEX "vehiculo_ID_Politica_de277b7e" ON "vehiculo" ("ID_Politica");
CREATE INDEX "vehiculo_ID_Sucursal_56e691bd" ON "vehiculo" ("ID_Sucursal");
CREATE INDEX "foto_ID_Vehi_7f51beea" ON "foto" ("ID_Vehi");
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log" ("content_type_id");
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "django_admin_log" ("user_id");
CREATE INDEX "django_session_expire_date_a5c62663" ON "django_session" ("expire_date");
CREATE INDEX "sucursal_ID_Localidad_f1480a8e" ON "sucursal" ("ID_Localidad");
CREATE INDEX "alquiler_IDEstado_1b7d682e" ON "alquiler" ("IDEstado");
CREATE INDEX "alquiler_vehiculo_id_d29a842f" ON "alquiler" ("vehiculo_id");
CREATE INDEX "alquiler_cliente_id_534fada6" ON "alquiler" ("cliente_id");
CREATE INDEX "usuario_localidad_id_a6e4e82e" ON "usuario" ("localidad_id");
CREATE INDEX "usuario_rol_id_ac58b608" ON "usuario" ("rol_id");
COMMIT;
