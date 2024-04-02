# ALNITAK

Proyecto generado para la configuración automática de un microservicio en NodeJs

## Requisitos

- [Instalar NodeJs LTS](https://nodejs.org/es/)
- Instalar Yeoman
  $ npm install -g yo
- Instalar dependencias necesarias

        $ npm install

- Ejecutar dentro de nodejs-generator/
  $ npm link

---

## Generar proyecto

Es necesario configurar el arranque del proyecto , seleccionando los modulos a agregar , para seleccionar los modulos a implementar se requiere de modificar el archivo de configuración.

     \generators\app\config.json
        {
            "name": "micro",
            "port": 3905,
            "modules":  ["connection","env","error","interceptors","logger","server","stream"]
        }

\*\* Donde "name" indicara el nombre del microservicio a generar , haciendo que cuando se genere el servicio utilice este nombre concatenando el sufijo "-service".

Por ejemplo colocando el nombre "axity" la generación del servicio resultara en "axity-service".

\*\* Port colocara en la configuración del servicio generado el puerto en el que debe arrancar.

\*\* Modules nos permitira seleccionar los modulos con los que el servicio se va a generar, entre los modulos disponibles para la propiedad se encuentran:

- connection
- env
- error
- interceptors
- logger
- server
- stream

Ejecutar el comando dentro de la carpeta generator/ :

        $ yo nodejs

Al ejecutar este comando , se generara un microservicio con los modulos y configuraciones previamente seleccionados.

Esto genera un proyecto llamado: [nombre ingresado]-service

---

## Configuración de Base de Datos Postgres local

En caso de no tener un servidor de Base de Datos Postgres, se puede instalar una imagen en un contenedor Docker, reemplazar los datos del servidor creado y ejecutar el servicio, por lo que se ejecutan los siguientes pasos:

Ejecutar el siguiente comando para crear el servidor Postgres en Docker

- El usuario por defecto será: postgres

```bash
  docker run --name postgres -d -p 5432:5432 -e POSTGRES_PASSWORD=mypass postgres:alpine
```

## Crear base de datos inicial

Conectarse a Postgres con cualquier herramienta que le permita comunicarse con las bases de datos como DBeaver o cualquier otra.

Una vez conectado , crear base de datos , en este ejemplo tendrá el nombre de project

- Host: localhost
- Port: 5432
- User: postgres
- Password: mypass

## Configuración de Datos de Conexión Postgres

Reemplazar los datos de los siguientes campos, por los datos del servidor de Base de Datos Postgres disponible:

- generator/[nombre ingresado]-service/.env

```bash
#can be 'development' or 'production'
NODE_ENV=development

#your app port
PORT=3905

#your DATABASE connection options
DB_NAME=project
DB_USER=postgres
DB_PASSWORD=mypass
DB_PORT=5432
DB_HOST=localhost

```

## Configuración de kafka local

En la raiz de la carpeta [nombre ingresado]-service crear el archivo docker-compose.yml

```bash
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.3.2
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  broker:
    image: confluentinc/cp-kafka:7.3.2
    container_name: broker
    ports:
    # To learn about configuring Kafka for access across networks see
    # https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/
      - "9092:9092"
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1

```

Una vez creado este archivo ,ejecute este comando para iniciar todos los servicios con docker:

```bash
docker compose up -d
```

---

## Operaciones con el Proyecto Generado

- Para cualquier operación sobre el proyecto generado es necesario navegar a la carpeta del servicio

        $ cd [nombre ingresado]-service

- Una vez generado el proyecto y ya en la carpeta correspondiente es necesario instalar las dependencias del servicio por lo que tenemos que ejecutar

      $ npm install

- Levantar servicio de manera local, con objetivos de pruebas/desarrollo

        $ npm start

- Ejecutar pruebas unitarias de manera local

        $ npm test

- Mostrar cobertura:

        $ npm run coverage

---

## Contributors

Javier Rodríguez  
[francisco.rodriguez@axity.com]  
Hugo Meraz  
[hugo.meraz@axity.com]  
Diego Armando Cárcamo Ortega
[diego.carcamo@axity.com]  
Luis David Gracia Barajas
[luis.gracia@axity.com]

## License

[MIT](https://opensource.org/licenses/MIT)

---

![CReA](/assets/CReA.png)

### Este ARTE forma parte del CReA de Axity, para mas información visitar [CReA](https://intellego365.sharepoint.com/sites/CentralAxity/M%C3%A9xico/Consultoria/Arquitectura/SitePages/CReA.aspx)
