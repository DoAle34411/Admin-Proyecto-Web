# Administrador en Aplicación Web con Remix  

El administrador de la aplicación web desarrollada con Remix es responsable de la gestión eficiente de los datos almacenados en la base de datos. Su rol se centra en realizar operaciones de Crear, Leer, Actualizar y Eliminar (CRUD) para las entidades principales del sistema. Estas acciones son esenciales para mantener la integridad y consistencia de la información.

## Funcionalidades principales  

### 1. Crear registros  
Permite ingresar nuevos datos en la base de datos, como usuarios, productos, categorías u otros elementos relevantes para la operación del sistema. En el presente caso, cuenta con CRUD completo para Libros y opciones de edicion en distinas paginas para usuarios y rentas. 

### 2. Leer registros  
Facilita la consulta de datos almacenados, ya sea mediante listados generales o la visualización de detalles específicos de cada registro. Permite leer los libros y rentas totales que existen en la base de datos.

### 3. Actualizar registros  
Brinda la capacidad de modificar información existente, asegurando que los datos reflejen los cambios y actualizaciones requeridos. De igual manera, permite editar usuarios y rentas, aunque en determinados campos por privacidad de los datos y consistencia de los mismos. 

### 4. Eliminar registros  
Proporciona la opción de borrar datos obsoletos o innecesarios, manteniendo la base de datos limpia y organizada. En este caso, solo se permite la operacion en libros.

## Conexión a la base de datos  
El administrador opera a través de una conexión segura con la base de datos, lo que garantiza el acceso y manipulación de los datos de manera eficiente y confiable. Remix gestiona estas operaciones mediante sus capacidades de enrutamiento y manejo de datos, optimizando el rendimiento del sistema.
Esta base de datos se encuentra en MongoDB, con la que se connecta gracias al .env que contiene tanto las credenciales de sesion como de la base. 
Este es el formato:

```bash
   MONGO_URI=CredencialesDadasPorMongo
SESSION_SECRET=tuSecretoDeSesion
```

## Característica adicional

- **Interfaz amigable**:  
  La administración se realiza desde una interfaz intuitiva desarrollada con Remix, diseñada para facilitar el uso incluso para usuarios sin experiencia técnica avanzada.

## Cómo usar este proyecto  

1. **Clona el repositorio**:  
   ```bash
   git clone https://github.com/DoAle34411/Admin-Proyecto-Web.git
   cd Ubicacion-Repo
   ```
2. **Instala dependencias**:
   ```bash
   npm install
   ```
4. **Ejecucion**:
   ```bash
   npm run dev
   ```
   Esto lleva al localhost:5147
