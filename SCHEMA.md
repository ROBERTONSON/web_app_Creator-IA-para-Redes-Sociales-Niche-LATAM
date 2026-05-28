# SCHEMA — Base de Datos Supabase

## Tabla: `generations`

Almacena todas las generaciones de contenido realizadas por los usuarios.

### Columnas

| Columna          | Tipo          | Restricciones                          | Descripción                              |
|------------------|---------------|----------------------------------------|------------------------------------------|
| `id`             | `uuid`        | PK, default `gen_random_uuid()`        | Identificador único de la generación     |
| `user_id`        | `uuid`        | FK → `auth.users(id)`, NOT NULL, CASCADE | Usuario propietario                    |
| `nicho`          | `nicho_type`  | NOT NULL                               | Nicho del negocio (enum)                 |
| `nombre_negocio` | `text`        | NOT NULL                               | Nombre del negocio                       |
| `pais`           | `text`        | NOT NULL                               | País del negocio                         |
| `ciudad`         | `text`        | NOT NULL                               | Ciudad del negocio                       |
| `promocion`      | `text`        | NOT NULL                               | Promoción o servicio a destacar          |
| `tono`           | `text`        | NOT NULL                               | Tono de comunicación seleccionado        |
| `objetivo`       | `text`        | NOT NULL                               | Objetivo de la publicación               |
| `post_instagram` | `text`        | NOT NULL                               | Post principal para Instagram            |
| `caption`        | `text`        | NOT NULL                               | Caption del post                         |
| `hashtags`       | `text[]`      | NOT NULL, default `'{}'`               | Array de hashtags (sin símbolo #)        |
| `historia`       | `text`        | NOT NULL                               | Idea para Instagram Story                |
| `cta`            | `text`        | NOT NULL                               | Llamada a la acción                      |
| `reel`           | `text`        | NOT NULL                               | Concepto para Reel                       |
| `created_at`     | `timestamptz` | NOT NULL, default `now()`              | Fecha y hora de creación (UTC)           |

### Enum: `nicho_type`

```sql
'odontologo' | 'peluqueria' | 'inmobiliaria' | 'gimnasio' | 'mecanico' | 'restaurante'
```

---

## SQL Completo de Inicialización

```sql
-- ============================================================
-- Creator IA LATAM — Schema de Base de Datos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Extensión para UUIDs
create extension if not exists "pgcrypto";

-- 2. Tipo enum para nichos
create type nicho_type as enum (
  'odontologo',
  'peluqueria',
  'inmobiliaria',
  'gimnasio',
  'mecanico',
  'restaurante'
);

-- 3. Tabla principal de generaciones
create table public.generations (
  id              uuid          primary key default gen_random_uuid(),
  user_id         uuid          not null references auth.users(id) on delete cascade,
  nicho           nicho_type    not null,
  nombre_negocio  text          not null,
  pais            text          not null,
  ciudad          text          not null,
  promocion       text          not null,
  tono            text          not null,
  objetivo        text          not null,
  post_instagram  text          not null,
  caption         text          not null,
  hashtags        text[]        not null default '{}',
  historia        text          not null,
  cta             text          not null,
  reel            text          not null,
  created_at      timestamptz   not null default now()
);

-- 4. Índice para consultas de historial por usuario
create index idx_generations_user_created
  on public.generations (user_id, created_at desc);

-- 5. Habilitar Row Level Security
alter table public.generations enable row level security;

-- 6. Política: SELECT — solo las propias generaciones
create policy "users_own_generations_select"
  on public.generations
  for select
  using (auth.uid() = user_id);

-- 7. Política: INSERT — solo insertar con el propio user_id
create policy "users_own_generations_insert"
  on public.generations
  for insert
  with check (auth.uid() = user_id);

-- 8. Política: DELETE — solo eliminar las propias generaciones
create policy "users_own_generations_delete"
  on public.generations
  for delete
  using (auth.uid() = user_id);
```

---

## Notas de Seguridad

- **RLS habilitado**: Ningún usuario puede leer, insertar o eliminar generaciones de otro usuario.
- **CASCADE en user_id**: Si un usuario es eliminado de `auth.users`, sus generaciones se eliminan automáticamente.
- **Sin UPDATE policy**: Las generaciones son inmutables por diseño. Si se necesita edición en el futuro, agregar política UPDATE.
- **`auth.uid()`**: Función de Supabase que devuelve el UUID del usuario autenticado en la sesión actual. Las políticas RLS la usan para filtrar automáticamente.

---

## Consultas Frecuentes

```sql
-- Historial del usuario autenticado (ordenado por fecha)
select * from generations
where user_id = auth.uid()
order by created_at desc;

-- Detalle de una generación específica
select * from generations
where id = $1 and user_id = auth.uid();

-- Contar generaciones del usuario
select count(*) from generations
where user_id = auth.uid();
```
