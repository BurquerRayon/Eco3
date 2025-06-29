Ok tenemos lo siguiente:

        eco-maravillas/     # Proyecto
        ├── client/         # React frontend
        └── server/         # Node.js backend

    Funcionalidades:

    Solo el cambio de pagina a otra con botones
        
        NavBar
           es Una barra de navegacion dinamica (aun sin probar ya que no esta recibiendo el valor que nesecita para cambiar)

    Paginas:
    
        Inicio/Home
            2 botones: Galeria y Mapa
            un carrosel con imagenes
            un chat GPT de la mision vision y valores de la empresa que creo que nunca lo preguntamos (si lo tienen avisen pls)

        Cliente/HomeCLient
            Es la pagina que vera el cliente este solo entra usuarios que han sido registrados con correo y contraseña y es exclusivo porque estos son los que van a ingresar los datos de sus tarjetas de credito y realizar pagos, etc....

        Empelado/HomeEmployee

            no hay mucho que explicar este es la pagina de los empleados en donde realizaran sus actividades

        No iniciado/HomeGuest
            Esta pagina hereda de Home osea actua como home pero no es el home como tal (espara los usuarios que no han iniciado sesion)

        About
            Esta pagina muestra la mision, vision y valor asi como otros datos de la pagina y de las cuevas


        Configuraciones
            Pagina destinada a los Usuarios administradores para generar cambios y modificaciones a la plataforma.

        dashboard
            Pagina principal y el panel de control de los usuarios administradores

        Gallery
            pagina destinada a ser una galeria de fotos con informacion/Descripcion de las diferentes especies de flora y fauna dentro de la cueva

        Gestion Reservas
            Pagina destinada a la gestion de la reservas creadas por los Usuarios clientes

        Gestion Usuario
            Pagina destinada a los administradores para la gestion y administracion los perfiles y accesos de usuarios.

        Login
            Inicio de sesion

        Map
            Pagina destinada para ser el mapa geografico, que funciona de manera interactiva para con los clientes

        NotFound
            pagina de error (funcion solo para nosotros como programadores)


        Registro 
            Pagina destinada al registro de nuevos usuarios

        Reportes
            Pagina destinada A la generacion de reportes por parte de los usuarios Empleados
        
        Reservas
            Pagina destinada a la creacion de reservas por parte de los usuarios clientes

    SRC

    Es donde se guarda el contenido del lado servidor (componentes, Stlyes css, etc.)

        AppRouter
            Es el gestor de las rutas de cada una de las paginas dentro del sistema

    Styles

        la carpeta donde se alojan los estilos .css de cada pagina

    







Errores/Corregir

La barra de navegacion no quiere cambiar de forma dinamica (no muestra el boton de cerrar sesion no los botones correspondientes de cada tipo de cuenta cuando sube si no que lo hace cuando se recarga la app)




Para La base de datos

Los datos actuales en .env a la hora de crear el proyecto son:

DB_USER=sa                          usuario de la base de datos
DB_PASSWORD=natanael                contraseña de la base de datos
DB_SERVER=DESKTOP-2NOMD28           . o nombre del servidor de la base de datos
DB_DATABASE=eco_maravillas          nodo donde se ubican las tabla dentro de la base de datos (como master)
DB_PORT=1433                        Puerto donde se conecta la base de datos (creo debo verificar)


el contenido de la base de datos lo creare en otro archivo .md