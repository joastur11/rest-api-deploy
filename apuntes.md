## REST API

REST: 
  Representational State Transfer: es una arquitectura de software. Se usa mucho para apis.
  Sus principios son: escalabilidad, simplicidad, portabilidad, visibilidad, fiabilidad y fácil de modificar.

  Fundamentos:
  Recursos: Cada recurso de REST se identifica con una URL.
  Verbos http: (get, post, delete, etc) definen las operaciones que se pueden hacer con los recursos
  Representaciones: los recursos pueden ser json, xml, html, etc. El cliente debería poder decidir la representación del recurso.
  Stateless: el servidor (el backend) no guarda ningún tipo de información, toda la info necesaria se la pasa el cliente para procesar la request.
  Interfaz uniforme: que nuestras url siempre tienen que hacer lo mismo, llamarse igual, etc.
  Separación de conceptos: permite que cliente y servidor evolucionen de forma separada.

  El endpoint de una api es un path(url) en el que tenemos un recurso

## Diferencias POST, PATCH y PUT

Primero: IDEMPOTENCIA: propiedad de realizar una acción determinada varias veces y siempre conseguir el mismo resultado que se obtendría al hacerlo 1.

POST: crear un nuevo elemento/recurso en el servidor.
  url: /movies 
  NO es idempotente porque siempre crea un nuevo recurso

PUT: actualizar un elemento ya existente o crearlo si no existe.
  url: /movies/123456 (id)
  SI es idempotente, el resultado sera siempre el mismo (por la id), mientras le pasemos los mismos datos, siempre va a hacer lo mismo.

PATCH: actualizar parcialmente un elemento.
  url: /movies/123456 (id)
  Normalmente si es idempotente como el put, pero depende, puede tener un recurso de Updated que cambie siempre. Puede pasar en el PUT pero no es normal.

## CORS

Cross origin resource sharing.
Sirve para decidir si un sitio web puede hacer fetch a otro servidor que está en un dominio diferente.
Es un mecanismo que te permite que un recurso sea restringido en una web para evitar que un dominio fuera de otro dominio pueda acceder a el.
Solo funciona en navegadores, porque hacen la petición (preguntan al origen) si puede acceder al recurso, y si el origen no especifica (en el header)
que puede acceder, el default es no.
Es un error común cuando queremos acceder desde el html (frontend) a un recurso de nuestra api (backend)
El permiso se da en el back end (check app.js)

Métodos normales (fáciles de manejar): GET/HEAD/POST
Métodos difíciles: PUT/PATCH/DELETE

Para los métodos difíciles de manejar, existe CORS Pre-flight. Cuando haces una request con PUT/PATCH/DELETE, requiere una petición especial llamada
OPTIONS, es una petición previa que hace el cliente automáticamente al hacer la otra, como que pregunta a la api si se puede borrar algo por ej. 
Para permitirlo, debemos manejar ese llamado en el server, por ej en el mio, app.options('./movies' etc)

