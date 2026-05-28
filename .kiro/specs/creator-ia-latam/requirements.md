# Documento de Requisitos

## Introducción

"Creator IA para Redes Sociales Niche LATAM" es un SaaS web impulsado por IA dirigido a pequeñas empresas de América Latina. La plataforma permite a negocios de nichos específicos (odontólogos, peluquerías, inmobiliarias, gimnasios, mecánicos y restaurantes) generar contenido localizado y optimizado para redes sociales mediante prompts especializados por nicho. El MVP incluye autenticación, selección de nicho, formulario generador, generación de contenido con Gemini API e historial de generaciones persistido en Supabase.

## Glosario

- **Sistema**: La aplicación web SaaS "Creator IA para Redes Sociales Niche LATAM"
- **Usuario**: Persona autenticada que utiliza la plataforma para generar contenido
- **Nicho**: Categoría de negocio soportada (Odontólogo, Peluquería/Salón de belleza, Inmobiliaria, Gimnasio, Mecánico, Restaurante)
- **Generación**: Conjunto de contenido producido por la IA para una solicitud específica, compuesto por post de Instagram, caption, hashtags, idea de historia, CTA e idea de Reel
- **Formulario_Generador**: Componente de UI que recopila los parámetros de entrada para la generación de contenido
- **Motor_IA**: Módulo que gestiona la comunicación con la API de Gemini para producir contenido
- **Historial**: Registro persistente de todas las generaciones realizadas por un usuario
- **Auth**: Módulo de autenticación basado en Supabase
- **Dashboard**: Interfaz principal protegida accesible solo a usuarios autenticados
- **Prompt_Template**: Plantilla de prompt especializada por nicho y localizada para LATAM
- **Supabase**: Plataforma de base de datos y autenticación utilizada como backend
- **Gemini_API**: API de inteligencia artificial de Google utilizada para la generación de contenido

---

## Requisitos

### Requisito 1: Autenticación de Usuarios

**User Story:** Como visitante, quiero registrarme e iniciar sesión en la plataforma, para acceder al dashboard y generar contenido de forma segura.

#### Criterios de Aceptación

1. THE Auth SHALL permitir el registro de nuevos usuarios mediante correo electrónico y contraseña.
2. WHEN un usuario proporciona credenciales válidas, THE Auth SHALL iniciar una sesión autenticada y redirigir al Dashboard.
3. IF un usuario proporciona credenciales inválidas, THEN THE Auth SHALL mostrar un mensaje de error descriptivo sin revelar información sensible.
4. WHILE un usuario no está autenticado, THE Sistema SHALL redirigir cualquier acceso al Dashboard hacia la página de inicio de sesión.
5. WHEN un usuario autenticado solicita cerrar sesión, THE Auth SHALL invalidar la sesión activa y redirigir a la página de inicio de sesión.
6. IF el servicio de Supabase no está disponible durante el proceso de autenticación, THEN THE Auth SHALL mostrar un mensaje de error indicando que el servicio no está disponible temporalmente.

---

### Requisito 2: Selección de Nicho

**User Story:** Como usuario autenticado, quiero seleccionar el nicho de mi negocio, para que el contenido generado sea relevante y especializado para mi industria.

#### Criterios de Aceptación

1. THE Sistema SHALL presentar al usuario una lista de exactamente seis nichos disponibles: Odontólogo, Peluquería/Salón de belleza, Inmobiliaria, Gimnasio, Mecánico y Restaurante.
2. WHEN un usuario selecciona un nicho, THE Sistema SHALL registrar la selección y habilitar el Formulario_Generador con los parámetros correspondientes a ese nicho.
3. THE Sistema SHALL mantener el nicho seleccionado visible durante toda la sesión de generación activa.
4. WHEN un usuario cambia el nicho seleccionado, THE Sistema SHALL limpiar los campos del Formulario_Generador y actualizar el Prompt_Template activo al correspondiente al nuevo nicho.

---

### Requisito 3: Formulario Generador de Contenido

**User Story:** Como usuario autenticado, quiero completar un formulario con los datos de mi negocio y campaña, para que la IA genere contenido personalizado y relevante.

#### Criterios de Aceptación

1. THE Formulario_Generador SHALL recopilar los siguientes campos obligatorios: nombre del negocio, país, ciudad, promoción o servicio a destacar, tono de comunicación y objetivo de la publicación.
2. WHEN un usuario intenta enviar el formulario con uno o más campos obligatorios vacíos, THE Formulario_Generador SHALL mostrar mensajes de validación específicos por campo sin enviar la solicitud al Motor_IA.
3. THE Formulario_Generador SHALL ofrecer opciones predefinidas para el campo "tono de comunicación" (por ejemplo: profesional, amigable, urgente, inspirador) además de permitir texto libre.
4. THE Formulario_Generador SHALL ofrecer opciones predefinidas para el campo "objetivo" (por ejemplo: atraer clientes, promocionar oferta, generar confianza, aumentar seguidores).
5. WHEN todos los campos obligatorios están completos, THE Formulario_Generador SHALL habilitar el botón de generación.

---

### Requisito 4: Generación de Contenido con IA

**User Story:** Como usuario autenticado, quiero que la IA genere contenido completo para redes sociales basado en los datos de mi negocio y nicho, para ahorrar tiempo y obtener publicaciones de calidad.

#### Criterios de Aceptación

1. WHEN el usuario envía el Formulario_Generador con datos válidos, THE Motor_IA SHALL enviar una solicitud a la Gemini_API utilizando el Prompt_Template correspondiente al nicho seleccionado.
2. THE Motor_IA SHALL generar los siguientes seis elementos de contenido en cada Generación: post para Instagram, caption, hashtags relevantes, idea de historia (Story), llamada a la acción (CTA) e idea corta para Reel.
3. THE Prompt_Template SHALL incluir instrucciones de localización para LATAM, incorporando el país y ciudad proporcionados por el usuario en el contenido generado.
4. WHILE la solicitud a la Gemini_API está en proceso, THE Sistema SHALL mostrar un indicador de carga visible al usuario.
5. IF la Gemini_API retorna un error o no responde en un plazo de 30 segundos, THEN THE Motor_IA SHALL mostrar un mensaje de error descriptivo al usuario y permitir reintentar la solicitud.
6. THE Motor_IA SHALL generar contenido en español latinoamericano, adaptado al país y ciudad especificados por el usuario.
7. WHEN la Generación es completada exitosamente, THE Sistema SHALL mostrar los seis elementos de contenido en secciones claramente diferenciadas y copiables individualmente.

---

### Requisito 5: Historial de Generaciones

**User Story:** Como usuario autenticado, quiero acceder a un historial de todas mis generaciones anteriores, para reutilizar o revisar contenido generado previamente.

#### Criterios de Aceptación

1. WHEN una Generación es completada exitosamente, THE Sistema SHALL persistir automáticamente todos los datos de la Generación (incluyendo los seis elementos de contenido, el nicho, los parámetros del formulario y la marca de tiempo) en Supabase asociados al usuario autenticado.
2. THE Historial SHALL mostrar únicamente las generaciones pertenecientes al usuario autenticado actualmente.
3. WHEN el usuario accede a la sección de Historial, THE Sistema SHALL recuperar y mostrar las generaciones del usuario ordenadas por fecha de creación descendente.
4. THE Historial SHALL mostrar para cada entrada: el nombre del negocio, el nicho, la fecha de creación y una vista previa del post de Instagram generado.
5. WHEN el usuario selecciona una entrada del Historial, THE Sistema SHALL mostrar el contenido completo de esa Generación con todos sus seis elementos.
6. IF no existen generaciones previas para el usuario, THEN THE Historial SHALL mostrar un mensaje indicando que aún no hay generaciones y un enlace directo al Formulario_Generador.

---

### Requisito 6: Interfaz de Usuario y Experiencia

**User Story:** Como usuario, quiero una interfaz moderna, responsiva y con modo oscuro, para tener una experiencia profesional y cómoda al usar la plataforma.

#### Criterios de Aceptación

1. THE Sistema SHALL implementar un layout de tipo sidebar con navegación lateral para el Dashboard, compatible con dispositivos de escritorio, tablet y móvil.
2. THE Sistema SHALL aplicar modo oscuro como tema predeterminado, utilizando gradientes modernos, tipografía clara y componentes tipo card.
3. THE Sistema SHALL ser completamente responsivo, adaptando el layout a pantallas con ancho mínimo de 320px.
4. WHEN el usuario interactúa con elementos de la interfaz (botones, cards, navegación), THE Sistema SHALL aplicar animaciones suaves con duración máxima de 300ms.
5. THE Sistema SHALL mostrar estados de carga (loading states) en todos los componentes que realicen operaciones asíncronas.
6. IF ocurre un error en cualquier operación de la interfaz, THEN THE Sistema SHALL mostrar un mensaje de error contextual sin interrumpir la navegación del usuario.

---

### Requisito 7: Seguridad y Manejo de Datos

**User Story:** Como usuario, quiero que mis datos y los secretos de la aplicación estén protegidos, para confiar en la plataforma con la información de mi negocio.

#### Criterios de Aceptación

1. THE Sistema SHALL almacenar todas las claves de API y secretos exclusivamente en variables de entorno del servidor, nunca expuestas en el cliente.
2. THE Sistema SHALL aplicar Row Level Security (RLS) en Supabase para garantizar que cada usuario solo pueda acceder a sus propias generaciones.
3. WHEN el usuario envía datos a través del Formulario_Generador, THE Sistema SHALL validar y sanitizar todos los inputs en el servidor antes de construir el Prompt_Template.
4. THE Sistema SHALL utilizar HTTPS para todas las comunicaciones entre el cliente y el servidor.
