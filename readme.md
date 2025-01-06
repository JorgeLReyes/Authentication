# Backend for login/register

## Configuracion del proyecto

### Envs

| Env-var           | default  | description           |
| ----------------- | -------- | --------------------- |
| PORT              | 3001     | Port app              |
| NODE_ENV          | dev      | Enviroment            |
| POSTGRES_USER     | username | Username db default   |
| POSTGRES_PASSWORD | password | Password db default   |
| POSTGRES_DBNAME   | db       | database name default |
| POSTGRES_URL      | url      | database url default  |
| SEED              | ---      | Token seed            |

### Docker

La base de datos usada por defecto se creó con docker con la imagen de postgres por lo cual si no se usa otra base de datos se debe montar una con el `docker-compose.yml`

Ejecutar en la terminal en la raiz del proyecto

```powershell
docker compose up -d
```

### Prisma

Se esta usando el ORM de prisma, por lo cual para seguir trabajando con este mismo se deben seguir los siguientes pasos:

1. Instalar dependencia de prisma: `npx i prisma` o `yarn prisma`
1. Inicia prisma: `npx prisma init --datasource-provider postgresql`
1. Si la base de datos fue creada en postgres y se desea traer el modelo construido se hace un `npx prisma db pull`
1. En caso de que se quiera crear el modelo de la base de datos desde prisma se requiere tener una tabla previa en postgres con el nombre que se necesite, el cual tambien será el nombre del modelo
1. Con el modelo se hace un `npx prisma migrate dev` para construir el modelo en la base y generar el cliente de prisma

> Se puede usar el ORM y base de datos que se requierá ya que el proyecto es escalable, solo se necesita construir el repositorio y el datasource adecuado

### Nota para frontend

Se generaron unas plantillas con pug para tener un cliente de una manera sencilla y poder probar la aplicacion, por lo cual si se quiere tener un cliente propio basta con importarlo al proyecto y configurar las rutas
