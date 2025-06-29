import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../../components/Carousel";
import "../../styles/Gallery.css";
import Footer from "../../components/Footer";
import "../../styles/Footer.css";

const Galeria = () => {
  const [filtroEspecie, setFiltroEspecie] = useState("");
  const [filtroHabitat, setFiltroHabitat] = useState("");
  const [especieSeleccionada, setEspecieSeleccionada] = useState(null);
  const navigate = useNavigate();
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null); //estado para mostrar caracteristica//
  const [imagenesMezcladas, setImagenesMezcladas] = useState([]);

  const imagenes = [
    //IMAGENES DE FAUNA//

    //1
    {
      nombre: "Cigua cara amarilla",
      especie: "tiaris olivacea",
      habitat: "Área Exterior",
      caracteristica:
        "Especie residente. Es común verla posada en las cercas de alambres de púas y en ramitas secas amontonadas. El nido es una pequeña copa o globular ubicado cerca del suelo. Pone 3 huevos manchados.",
      src: "/assets/img/Fauna/Cigua.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //2
    {
      nombre: "Pajaro Bob",
      especie: "Surothera longirostris",
      habitat: "Área Exterior",
      caracteristica:
        "Especie endemica. Esta ave es muy útil ya que se alimenta de insectos y larvas dañinas para la agricultura. Es perseguida por su carne que se considera, erroneamente, medicinal. Anida en árboles, entre las ramas, bien escondido. Pone de 2 a 3 huevos blancos. Es una especie con veda permanente.",
      src: "/assets/img/Fauna/Bob.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //3
    {
      nombre: "Lechuza cara ceniza",
      especie: "Tyto glaucops",
      habitat: ["Cueva", "Área Exterior"],
      caracteristica:
        "Especie endémica. Esta ave es muy parecida a la especie Tyto alba, pero ésta es de un color más claro. Anida en cuevas, huecos de árboles y lugares oscuros. ",
      src: "/assets/img/Fauna/Tyto.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //4
    {
      nombre: "Lechuza común",
      especie: "Tyto alba",
      habitat: ["Cueva", "Área Exterior"],
      caracteristica:
        "Las lechuzas son aves nocturnas y se alimentan de pequeñas ratones y Murciélagos. Esta ave es perseguida por falsas creencias de que es de mal agüero. Es una especie protegida con veda permanent. Anida en cuevas, huecos de árboles, edificios abandonados y en otros lugares oscuros. Pone de 2 a 8 huevos blancos. ",
      src: "/assets/img/Fauna/Tyto.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //5
    {
      nombre: "Marpesia eleuchea ",
      especie: "Nymphalidae",
      habitat: "Área Exterior",
      caracteristica:
        "Es una mariposa caribeña de color leonado con una franja anterior negra, que posee además dos colitas en las alas posteriores. Prefiere los bosques antes que los espacios claros, donde se alimenta de las flores de los árboles. Es especialmente abundante en los meses de junio y julio.",
      src: "/assets/img/Fauna/Marpesia.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //6
    {
      nombre: "Mariposa cola de golondrina de borde dorado",
      especie: "Polydamas swallowtail. Polilionidae",
      habitat: "Área Exterior",
      caracteristica:
        "Mariposa de gran tamaño y colores oscuros. En nuestro país existen solo dos especies de Battus, B. zetides que es endemica y B. polydamas que tiene una distribución amplia en América y en todo el país. A diferencia de la primera, B. polydamas no tiene colitas. Nunca para de agitar las alas cuando se está alimentando.",
      src: "/assets/img/Fauna/Polydamas.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //7
    {
      nombre: " Dryas iulia",
      especie: "Mariposa Julia. Heliconidae ",
      habitat: "Área Exterior",
      caracteristica:
        "Al igual que Agrauls vanillae. Es de color anaranjado, pero la mariposa Julia tiene las alas mucho más alargadas y no posee manchas plateadas. Tiene los mismos hábitos alimenticios. ",
      src: "/assets/img/Fauna/Dryas.webp",
      tipo: "Fauna",
      todas: "todas",
    },
    //8
    {
      nombre: "Junonia genoveva ",
      especie: "Nymphalidae",
      habitat: "Área Exterior",
      caracteristica:
        "Es una mariposa muy esquiva, cuando alguien se le acerca inmediatamente vuela a otro lugar cercano. Tiene grandes ojos falsos marrones en el dorso de sus alas.",
      src: "/assets/img/Fauna/palmarun.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //9

    {
      nombre: "Viuda Negra",
      especie: "Latrodectus mactans",
      habitat: "Cueva",
      caracteristica:
        "Esta araña es conocida por su veneno, que según la creencia usa para atacar al macho de su especie. Aunque se han reportado casos de ataques a humanos, en la isla no se han reportado muertes.",
      src: "/assets/img/Fauna/Mactans.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    //10
    {
      nombre: "taladro del ramo",
      especie: "Trachyderes succintus ",
      habitat: "Área Exterior",
      caracteristica:
        "Este insecto es conocido como ciervo volante o como le llamamos en la isla: chivito volador. Esta especie se alimenta de madera y hace la función de reciclar la materia orgánica para introducirla de nuevo al ambiente en forma de excremento.",
      src: "/assets/img/Fauna/Trachy.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    //11
    {
      nombre: "Chicharra",
      especie: "Cicadidae",
      habitat: "Area Exterior",
      caracteristica:
        "A esta familia pertenecen las famosas chicharras, conocidas por su estruendoso canto. La hembra es muda y el macho es el que canta para atraerla a su nido.",
      src: "/assets/img/Fauna/chicarra.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //12
    {
      nombre: "Abeja",
      especie: "Apis melifera",
      habitat: "Área Exterior",
      caracteristica:
        "Esta es la abaja productora de miel, garantizando la polinización de varias especies arbóreas y frutales. ",
      src: "/assets/img/Fauna/apis.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //13
    {
      nombre: "Rana",
      especie: "Osteopilus dominicensis",
      habitat: ["Área Ácuatica", "Area Exterior"],
      caracteristica:
        "Endémica. Se le conoce como rana arborícola por su tendencia a subirse en los árboles y solo bajar en las noches. Se les encuentra con mucha frecuencia pegada en las paredes de los baños. Habita en varios tipos de ambientes. Se alimenta de insectos y su croar es un canto muy fuerte que se escucha en las noches.",
      src: "/assets/img/Fauna/Ostedomi.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //14
    {
      nombre: "Calcali",
      especie: "Eleutherodactylus Abbotti",
      habitat: ["Área Ácuatica", "Area Exterior"],
      caracteristica:
        "Existen 55 especies de ranas de este grupo en la isla y todas son endémicas. Pertenece al mismo grupo de los coquíes de Puerto Rico. Su canto es frecuente escucharlo en lugares húmedos. Se alimenta de pequeños insectos y a diferencia de otros anfibios no pasa por el estado larvario.",
      src: "/assets/img/Fauna/abbotti.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //15
    {
      nombre: "Lagartija común",
      especie: "Anolis ditichus",
      habitat: "Area Exterior",
      caracteristica:
        "Del grupo de los Anolis o lagartos con saco gular. Mide aproximadamente seis centímetros. Habita casi exclusivamente en los árboles, aunque es posible observarlos en el suelo. Es nativa, con una distribución muy amplia en toda la Isla. Habita también en las Bahamas. Su saco gular es amarillo pálido a naranja Brillante o con una mancha central anaranjada, y su cuerpo de color verdoso. Se mueve con destreza y prefiere comer pequeños insectos. Se reproduce a todo lo largo del año. ",
      src: "/assets/img/Fauna/anolis.JPG",
      tipo: "Fauna",
      todas: "todas",
    },
    //16
    {
      nombre: "Culebra Sabanera ",
      especie: "Antillophis parvifrons",
      habitat: "Area Exterior",
      caracteristica:
        "Otra de las clásicas culebras, que habitan la isla. Es exclusivamente terrestre y se encuentra en todo el territorio nacional, inclusive en el Pico Duarte. De hábitos diurnos. Se alimenta de pequeñas lagartijas, ranitas y algunos insectos. Su cuerpo es de color negro a gris con dos líneas laterales oscura a cada lado del cuerpo.",
      src: "/assets/img/Fauna/culebraS.JPG",
      tipo: "Fauna",
      todas: "todas",
    },
    //17
    {
      nombre: "Boa de la Hispaniola",
      especie: "Epicrates striatus",
      habitat: ["Cueva", "Area Exterior"],
      caracteristica:
        "Esta es la culebra más grande que existe en la isla, llegando a alcanzar hasta los ocho pies de longitud, aunque se han reportado más grandes. Es nativa de la Hispaniola. Se encuentra también en las Bahamas. Vive sobre los árboles. Se alimenta de huevos, ratones, gallinas, y otros vertebrados. Especie protegida con veda permanente, que puede ser vista en la zona. En peligro de extinción.",
      src: "/assets/img/Fauna/boa.JPG",
      tipo: "Fauna",
      todas: "todas",
    },
    //18
    {
      nombre: "Falsa Boa ",
      especie: "Tropidophis haetianus",
      habitat: "area exterior",
      caracteristica:
        "Especie de culebra muy poco conocida por los dominicanos, ya que tiene hábitos nocturnos, arborícolas y es muy pequeña. Mide aproximadamente 72 centímetros. Prefiere los lugares con mucha vegetación y es algo de humedad. Es completamente inofensiva y se alimenta de ranitas, lagartijas y otros vertebrados. Es nativa de la isla. Habita también en Cuba y Jamaica.",
      src: "/assets/img/Fauna/boaT.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Julián chiví",
      especie: "Vireo Altiloquus",
      habitat: "area exterior",
      caracteristica:
        "Esta ave es muy difícil de localizar por su canto que parece venir de un lugar contrario a donde está el ave. También su color la protege. Su nombre viene de su canto, un interminable Julián chiví. Anida en árboles a una elevación moderada. Pone de 2 a 3 huevos manchados.",
      src: "/assets/img/Fauna/vireo.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Ruiseñor",
      especie: "Mimus polyglottos",
      habitat: "area exterior",
      caracteristica:
        "Esta ave tiene un canto muy hermoso y conocido, pero también imita sonidos y el canto de otras aves. Se alimenta de insectos, pequeñas semillas y frutas. El nido está hecho de ramitas secas y finas, construido en un árbol o arbusto con espinas, no muy alto. Pone de 2 a 3 huevos color gris pálido y manchados.",
      src: "/assets/img/Fauna/Mimus.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Rolon rabiche ",
      especie: "Zenaida macroura",
      habitat: "area exterior",
      caracteristica:
        "Esta especie es muy parecida a Zenaida aurita (Rolón), pero esta última tiene la cola cuadrada, no puntiaguda. Anida en árboles, a mediana altura, en un nido rústico hecho de ramas pequeñas. Pone 2 huevos.",
      src: "/assets/img/Fauna/Rolon.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Rolita",
      especie: "Columbina passerina",
      habitat: "area exterior",
      caracteristica:
        "Es una especie muy común. Esta ave se ve generalmente en el suelo, le gusta caminar. Es muy perseguida por cazadores, pero su población sigue siendo alta, debido a periodos de veda de seis meses al año. Anida en árboles, haciendo un nido rústico de palitos secos. Pone 2 huevos y anida varias veces al año.",
      src: "/assets/img/Fauna/Rolita.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Carpinterio",
      especie: "Melanerpes striatus",
      habitat: "area exterior",
      caracteristica:
        "Esta especie es endémica y una de las aves más abundantes en el país. Su comida consiste principalmente en insectos, que busca picando la corteza de los árboles y algunas frutas, por lo cual ha sido perseguido por nuestros campesinos. Hace su nido en huecos de árboles que el mismo construye",
      src: "/assets/img/Fauna/Carpintero.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Cuyaya",
      especie: "Falco sparverius",
      habitat: "area exterior",
      caracteristica:
        "Esta especie es el halcón más pequeño que habita en la República Dominicana. Es común verla en postes del tendido eléctrico en carreteras y ciudades. A esta ave, llamada de rapiña, se le protege con veda permanente. Ha sido perseguida por la creencia errónea de que come pollos. Se alimenta de pequeños roedores, lagartos e insectos. Pone de 2 a 5 huevos. Anida en huecos de árboles o en pencas de palmas.",
      src: "/assets/img/Fauna/Cuyaya.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Manuelito",
      especie: "Myiarchus stolidus",
      habitat: "Area Exterior",
      caracteristica:
        "Al igual que los demás miembros de la familia, se alimenta de insectos que atrapa en el aire. Esta especie tiene su área de acción cerca del suelo, generalmente volando bajo. Anida en huecos de árboles o en postes. Pone de 3 a 4 huevos manchados.",
      src: "/assets/img/Fauna/Manuelito.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Barrancoli",
      especie: "Touds subulatus",
      habitat: "Area Exterior",
      caracteristica:
        "Ave endémica de la isla. Pertenece a la familia Todidade que es exclusiva de las Antillas Mayores. Es una especie muy parecida al Chicui (Todus angustirostris), pero esa última no se ve en elevaciones bajas, y el canto de las dos especies es muy diferente. Anida es pequeños barrancos, haciendo un hueco en la tierra. Pone de 3 a 4 huevos blancos. Especie protegida con veda permanente.",
      src: "/assets/img/Fauna/Barrancoli.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "la mariposa azufre sin nubes",
      especie: "Phoebis sennae",
      habitat: "Area Exterior",
      caracteristica:
        "Suele acompañar a Kricogonia lyside en sus movimientos migratorios. Aunque tienen coloración similar, Phoebis sennae presenta dos pequeños puntos plateados con borde dorado en el lado inferior de las alas posteriores y uno en las alas anteriores. La larva se alimenta de hojas de leguminosas.",
      src: "/assets/img/Fauna/Pieri.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa blanca.",
      especie: "Ascia Monuste",
      habitat: "Area Exterior",
      caracteristica:
        "Estas mariposas acostumbran tomar sodio del suelo. Cuando una mariposa descubre un buen lugar para tomarlo otras rápidamente la seguirán. Este sodio les ayuda a restablecerse de su esfuerzo en la busqueda de pareja y reponer fuerzas para continuar la migración. Ascia monuste es la más blanca de todas las migrantes y tiene el borde de las alas de color oscuro.",
      src: "/assets/img/Fauna/Ascia.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "La mariposa de San Juan",
      especie: "Kricogonia lyside",
      habitat: "Area Exterior",
      caracteristica:
        "Sin duda alguna es la mariposa más conocida en la República Dominicana. Por razones no comprendidas todavía, emprende grandes migraciones durante los meses de verano, especialmente en el Suroeste y el Este del país. Sus larvas se alimentan de las hojas del Guayacán.",
      src: "/assets/img/Fauna/SanJuan.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Tronadora Caribeña",
      especie: "Hamadryas amphichloe",
      habitat: "Area Exterior",
      caracteristica:
        "Es la única gran mariposa gris de nuestra fauna. Suele posarse de cabeza sobre los troncos de los árboles, o sobre los visitantes que invadan su territorio. Durante los meses de verano es muy abundante en las regiones Sur y Este.",
      src: "/assets/img/Fauna/Amphi.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Saltarina Obscura",
      especie: "Panoquina panoquinoides",
      habitat: "Area Exterior",
      caracteristica:
        "Tiene una gran distribución en toda América. Se distingue por un pequeño punto amarillo en las alas anteriores. Su coloración general es marrón y su vuelo muy rápido. Ocasionalmente, entra en las casas donde se supone que anuncia los visitantes.",
      src: "/assets/img/Fauna/chicarra.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Hiedevivo ",
      especie: "Pentatomidae",
      habitat: "Area Exterior",
      caracteristica:
        "Chinche de plantas. Algunos chinches se alimentan de la savia de las plantas o de otros insectos y mamíferos. Para eso cuentan con un estilete que clavan en sus víctimas. En general no son peligrosos, pero algunos pueden ser muy molestosos. Desprenden un fuerte y desagradable olor, características a la cual debe su nombre común.",
      src: "/assets/img/Fauna/Hiedevivo.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Libelula verde",
      especie: "Erythemis vesiculosa",
      habitat: "Area Exterior",
      caracteristica:
        "Su nombre comun se debe a la extraordinaria coloracion verde que presentan en el cuerpo. Su vuelo es potente ya que es un experto cazador de otros insectos. Es muy comun en la region Este del pais.",
      src: "/assets/img/Fauna/Esmeralda.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Caballito de bandas negras",
      especie: "Erithrodiplax umbrata",
      habitat: "Area acuatica",
      caracteristica:
        "Conocido comúnmente como Caballito del Diablo. Habita en charcas o lugares asociados con pozos de agua. Es una especie totalmente carnívora, depredadora de otros invertebrados y de pequeños vertebrados, como los renacuajos de las ranas.",
      src: "/assets/img/Fauna/Banda.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Culebra Verde Hocico Puntiagudo",
      especie: "Uromacer Catesbyi",
      habitat: "Area Exterior",
      caracteristica:
        "Especie endémica. Las culebras verdes son las más características culebras de la isla, ya que son bien conocidas por los dominicanos, y pocas veces las matan. Aunque alcanzan longitudes de casi cinco pies de largo, son muy delgadas. Habitan en los arbustos, donde se desplazan con mucha gracia. Se alimenta de pequeños vertebrados, como lagartijas, ranitas y, pequeñas aves. Presenta un color verde oscuro a todo lo largo del cuerpo con la punta de la boca roma.",
      src: "/assets/img/Fauna/culebraV.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Culebra Verde Hocico Puntiagudo",
      especie: "Uromacer oxyrhynchus",
      habitat: "Area Exterior",
      caracteristica:
        "Otra de las tres especies de culebras verde que habitan en la isla. Todas endémicas. Alcanza hasta cinco pies de largo. A diferencia de la catesbyi, el cuerpo es verde olivo en la parte dorsal, con un verde más claro en la parte lateroinferior, separados ambos colores por una clara línea de color blanca o amarillenta. Se alimentan de pequeños vertebrados y habitan en una gran variedad de ambiente a todo lo largo de la isla. Es exclusivamente arborícola.",
      src: "assets/img/Fauna/CulebraVU.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Gallito prieto ",
      especie: "Loxigilla violacea",
      habitat: "Area Exterior",
      caracteristica:
        "La combinación de los colores negro y rojo le dan una hermosa apariencia a esta ave. Es muy activa y hay que estar muy atento para poder verla. Es común pero poco conocida. Anida en arbustos cerca del suelo. Pone 3 huevos manchados.",
      src: "/assets/img/Fauna/Loxi.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Cuatro ojos ",
      especie: "Phaenicophilus palmarum",
      habitat: "Area Exterior",
      caracteristica:
        "Especie Endémica. Esta hermosa ave es muy común, ya que se le puede ver hasta en los jardines y patios en las ciudades. El nido tiene forma de copa. Pone de 3 a 4 huevos verdes y manchados.",
      src: "/assets/img/Fauna/palmarun.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "mariposa cebra",
      especie: "Heliconius charitonius",
      habitat: "Area Exterior",
      caracteristica:
        "La mariposa cebra es de amplia distribucion en el trópico americano. Es fácilmente distinguible por rayas intercaladas negras y amarillas brillantes de las cuales proviene su nombre. Prefiere los bosques húmedos de baja o mediana elevación.",
      src: "/assets/img/Fauna/Heli.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa Pavoreal Blanca",
      especie: "Anartia jatrophae",
      habitat: "Area Exterior",
      caracteristica:
        "Una de las mariposas mas comunes en prados y jardines. Se caractiza por la presencia de dos ojos. Es muy agresiva con otras mariposas. Su vuelo es bajo y delicado.",
      src: "/assets/img/Fauna/Peacock.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Espejitos",
      especie: "Agraulis vanillae",
      habitat: "Area Exterior",
      caracteristica:
        "Es el heliconiido anaranjado más común de la República Dominicana. Su abundancia en las zonas urbanas se debe a que se alimenta de chinolas (Pasiflora edulis). Se puede reconocer fácilmente por sus peculiares manchas plateadas bien visibles en la parte ventral de las alas cuando la mariposa esta alimentándose de las flores.",
      src: "/assets/img/Fauna/Vani.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa de borde rojo",
      especie: "Biblis hyperia",
      habitat: "Area Exterior",
      caracteristica:
        "Es la única especie de nuestro país que posee una franja roja sobre fondo negro. Sus larvas se alimentan de pica-pica (gratey). Vive principalmente en la región Este del país.",
      src: "/assets/img/Fauna/bordeR.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa golondrina zebra",
      especie: "Protesilaus zonarius",
      habitat: "Area Exterior",
      caracteristica:
        "Mariposa endémica de la isla de Santo Domingo. De vuelo rápido y bajo. Habita comúnmente en el bosque seco y es especialmente observada en los meses de junio y julio. Pertenece al grupo conocido como 'colar de golondrina' (swallow-tail).",
      src: "/assets/img/Fauna/Prote.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Saltarina de Cola Larga",
      especie: "Urbanus dorantes",
      habitat: "Área exterior",
      caracteristica:
        "Esta mariposa presenta poco dimorfismo sexual entre machos y hembras y al igual que Eunica monima, es común en todos los ambientes de la isla. Habita, además, en América continental y el Caribe.",
      src: "/assets/img/Fauna/Urbanus.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa emperatriz de banda amarilla",
      especie: "Asterocampa idyia",
      habitat: "Area exterior",
      caracteristica:
        "Esta mariposa presenta también un gran dimorfismos sexual entre machos y hembras, ya que el macho es de un color más oscuro que la hembra, y esta presenta marcas azules y blancas, y diferencias en el tamaño, color y forma de las alas. Son muy comunes en toda la isla, especialmente en lugares arbóreos y ocasionalmente cerca de plantanaciones frutales.",
      src: "/assets/img/Fauna/idyia.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa de Alas Púrpura Oscura",
      especie: "Eunica Monima (Nymphalidae)",
      habitat: "Area exterior",
      caracteristica:
        "Esta mariposa presenta poca diferencia entre el macho y la hembra. Es muy comun en toda la isla, incluso en las ciudades. Se observan en mayor cantidad durante el verano. Habitan tambien en America continental y las Antillas.",
      src: "/assets/img/Fauna/eunica.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariguanita",
      especie: "Leiocephalus lunatus",
      habitat: "Area Exterior",
      caracteristica:
        "Lagarto endémico de nuestra isla. Mide aproximadamente siente centímetros. Habita a todo lo largo de la costa Este, desde Santo Domingo hasta Higüey. Una característica peculiar de este animal es que presenta las patas posteriores de color verde con la cola rojiza. Prefiere lugares rocosos y soleados donde pasar varias horas calentándose. Se alimenta de insectos y su reproducción es ovípara. ",
      src: "/assets/img/Fauna/marihuanaL.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Lagarto Enmascarado de Cola Rizada",
      especie: "Leiocephalus personatus",
      habitat: "Area Exterior",
      caracteristica:
        "Del mismo grupo de la lunatus. Mide aproximadamente 8 centímetros y medio. La principal característica de este grupo de lagarto es que cuando descansan, su cola se enrolla hacia arriba en forma de un semi-círculo. A diferencia de lunatus, esta especie presenta las patas posteriores al igual que la cola de un color rojizo. Se alimentan de pequeños insectos y su reproducción es ovípara.",
      src: "/assets/img/Fauna/marihuanaL.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Lagarto verde ",
      especie: "Anolis Chlorocyanus",
      habitat: "Area Exterior",
      caracteristica:
        "Endémica. Está siendo sustituida por otra especie de lagarto verde introducida de Cuba y que habita la copa de los árboles, al igual que la nuestra. Presenta el saco gular azuloso, mientras que el introducido lo presenta de color rosado. Mide 8 centímetros de largo. Habita preferiblemente en la copa de árboles altos. Se alimenta de insectos como esperanza, grillos y otros lagartos más pequeños.",
      src: "/assets/img/Fauna/lagartoV.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    //IMAGENES DE FLORA//

    {
      nombre: "Guayacán",
      especie: "Guaicum officinale L.Zygophyllaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 10 m. de altura, con hojas de 3 a 9 cm, compuestas de 4 a 6 foliolos u hojuelas de 1.5 cm, redondeadas. Flores de pétalos azules abovados, de 12 mm. Frutos de 15 a 20 mm, de color anaranjado o amarillo. La madera, pesada y fuerte, es una de las más duras del mundo, con propiedades lubricantes. Es usada en trabajos especiales en buques, rodillas, poleas y tornos. Por sus propiedades medicinales se conoce desde hace varios siglos como Lignum vitae (Leño de la vida). De su resina se extrae el guayacol. La resina y la corteza se aprovechan para combatir numerosas enfermedades, entre ellas algunas de transmisión sexual. Es melífera. Crece en zonas pedregosas y secas, principalmente en areas costeras. Nativa de América tropical. Es el árbol nacional de Bahamas.",
      src: "/assets/img/Flora/Guayacan.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Carga agua",
      especie: "Erythoroxylum brevipes DC. Erythroxylaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto de hasta 5 m. de altura muy ramoso. Con hojas abovadas a oblongo-abovadas o elípticas, subcoriaceas, cactáceas o membranosas, obtusas, redondeadas o emarginadas en el ápice y estrechadas en la base; pálidas en el envés y el nervio de color rojizo o blancuzco. Sus flores son de pétalos color blanco y su fruto es una drupa elipsoidea de color rojo, de 5 a 9 mm. En la provincia La Altagracia usan sus ramas para hacer escobas. Nativa de Las Antillas, Bahamas, Yucatán y América Central.",
      src: "/assets/img/Flora/Brevipes.jpeg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Joboban Cabo de hacha",
      especie: "Meliaceae trichilia hirta L.",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 10 m. De altura, con hojas compuestas de 9 a 21 folíolos lanceolados, lanceolado oblongos, agudos o acuminados, y flores de color verde a amarillento. Su fruto es una cápsula globosa. La madera es de color castaño-rojizo, es resistente y se usa para fabricar magos(cabos), postes, ebanistería y leña. Es melífera. Sus hojas se usan para madurar aguacates y se consideran insecticidas, usadas para ahuyentar las pulgas. Es medicina popular se usa como emenagogo y para resfriados, pero se dice que puede ser abortiva.",
      src: "/assets/img/Flora/Joboban.jpeg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Maya Cimarrona",
      especie: "Bromelia plumieri",
      habitat: "Area Exterior",
      caracteristica:
        "Herbácea con hojas de hasta 2 m. de largo, espinosas en los bordes, agrupadas en forma de roseta. Inflorescencia corta y ancha, oculta en la roseta de hojas, con flor de 6 a 9 cm. El fruto es una baya de aproximadamente 8 cm. Especie ornamental. Nativa de América tropical.",
      src: "/assets/img/Flora/bromelia.jpeg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Trejo",
      especie: "Adelia ricinella L. Euphorbiacaeae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 7 m. de altura, con hojas de forma oblonga a obovada, redondas a agudas, de 1 a 7.5 cm. Tiene flores estimanadas y flores pistiladas. El fruto es una cápsula trilobata de 6 a 8 mm. Es común en zonas secas y semisecas. Nativa de las Antillas.",
      src: "/assets/img/Flora/Adelia.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Guano",
      especie: "Coccothrinax barbadensis ",
      habitat: "Area Exterior",
      caracteristica:
        "Palma con el tronco solitario de hasta 12 m. de altura y de 5 a 18 cm. de diámetro. Con hojas en forma de abanico, redondeadas. Inflorescencia curva hacia abajo, con 3 a 10 ramas primarias. El fruto es globoso, color púrpura, casi negro al madurar. Sus hojas son usadas para artesanía en la elaboración de escobas, macutos, sogas, etc. Nativa de las Antillas Menores, Puerto Rico y la República Dominicana.",
      src: "/assets/img/Flora/coccothrinax.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Uña de gato",
      especie: "Pisonia aculeata L. Nyctaginaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto sarmentoso semi trepador, con espinas encorvadas, por lo que se le denomina una de gato. Los frutos tienen una sustancia pegajosa en la cual suelen pegarse las plumas de las aves. De ahí su nombre común de pega pollo. Sus hojas son elíptico-ovales, muy variables, de 2.5 a 15 cm. y agudas. Sus flores de color amarillento y el fruto de 9 a 12 mm. Es melífera. La corteza y las hojas se usan contra la artritis. Nativa de los trópicos y sub-trópicos de América tropical.",
      src: "/assets/img/Flora/Pisonia.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Escobon de vara",
      especie: "Eugenia ligustrina(Sw.) Wild. Myrtaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto de hasta 4 m. de hojas oblongas a estrechadas. Flores de pétalos color blanco, de 8 a 12 mm. Su fruto es globoso, de color rojo-negruzco cuando está maduro, de unos 8 mm. y comestible. Las hojas se utilizan para 'la buena'. Usada como ornamental. Nativa de las Antillas y de Suramérica tropical.",
      src: "/assets/img/Flora/Axillaris.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "guázara",
      especie: "Eugenia glabrata(Sw.) DC. Myrtaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto de hasta 10 m. de altura. De hojas elípticas a elíptico-oblongas o aovadas, de 3.5 a 8 cm, acuminadas. Los pétalos son de color blanco. El fruto es una baya oblonga, de 10 a 13 mm, que se usa para fabricar un licor. Su madera es resistente y se usa para postes, en empalizadas, en construcciones rurales y como leña. Nativa de las Antillas Mayores.",
      src: "/assets/img/Flora/Eugeniaglabrata.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "cabo de chivo, escobillo",
      especie: "Myrciaria floribunda (West.) Berg. Mytaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto que en su madurez puede alcanzar hasta 10 m. de altura, con ramitas muy delgadas y hojas lanceoladas, aovado-lanceoladas a oblongo-lanceoladas, de 4 a 7 cm., largo-acuminadas. Flores sentadas, en grupos pequeños. Frutos sub-globosos, color rojo o amarillo aromáticos, de 8 a 10 mm. Con los frutos de esta especie se elabora el famoso 'guavaberry', bebida típica de San Pedro de Macorís. La madera es dura y compacta, de color rojo pardo, muy usada para postes y varas; y en construcciones rurales. Es excelente como leña. Nativa de América tropical.",
      src: "/assets/img/Flora/Eugenia.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Higo Cimarron",
      especie: "Ficus citrofilia. P. Mill. Moraceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 15 m. de altura, de hojas aovadas o aovado-acorazonadas, de 4 a 9 cm, . Algo escabrosas (ásperas). A veces se usa como seto vivo. Su corteza Se ha usado como fibra para hacer cuerdas. El fruto sirve de alimento a algunas aves. Nativas de América tropical.",
      src: "/assets/img/Flora/Ficus.jpeg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Palo amargo, Almendra de lavar",
      especie: "Trichilia pallida Sw. Meliaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 8 m. De hojas compuestas con 3 a 7 folíolos u hojuelas, oblongo-elipticas, oblanceoladas a obovadas, el folíolo terminal usualmente más grande. Las flores son de color blanco y el fruto es una cápsula ovoidea de 1 a 1.5 cm. La madera es color blanco, dura y pesada. Se usa en construcciones rurales. La planta tiene una sustancia que hace espuma y que se emplea para lavar ropa. Nativa de las Antillas Mayores, excepto Jamaica.",
      src: "/assets/img/Flora/Pallida.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Vera, Guayacancillo ",
      especie: "Guaiacum sanctum L. Zygophyllaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 10 m. de altura y tronco de hasta 30 cm. de grosor. De hojas compuestas por 4 a 12 folíolos u hojuelas, oblongas y obovadas. Pétalos azules o purpúreos, anchamente abovados, de 7 a 12 mm., redondeados. El fruto es una cápsula obovoidea, de color amarillo o anaranjado, de 1.5 cm. La madera, dura y resistente, es usada para construcciones rurales, tornería, ebanistería, y como leña y carbón. Es melífera. Tiene potencial ornamental. Crece en terrenos rocosos y secos, usualmente en zonas costeras. Nativa de la América continental tropical, las Antillas Mayores, excepto Jamaica, y de las Bahamas.",
      src: "/assets/img/Flora/Sanctum.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Pega Palo, Abrazapalo ",
      especie: "Macfadyena unguis-catis(L.) A.Gentry Bignoniaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Trepadora de 10 a 15 m. De hojas terminadas en zarcillos. Cáliz verdoso y flores color amarillo muy vistoso. Fruto en silicua. Se usa en medicina popular. Es melífera. Nativa de las Antillas y de América tropical continental.",
      src: "/assets/img/Flora/Abrazapalo.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Bayahonda, Cambron, Aroma ",
      especie: "Acacia macracantha H.& B. Mimosaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de 6 a 7 m. de altura, que usualmente tiene espinas en el tronco y las ramas. Sus hojas son bi-compuestas con muchos pares de pinas y de folíolos y hojuelas. Flores de color amarillo en cabezuelas. Su fruto es una legumbre aplastada de 7 a 12 mm. de ancho. Su madera es dura y resistente y se usa para postes de empalizadas y en construcciones rurales, también como leña y carbón. La corteza se usa en la medicina popular para la gripe. Nativa de América tropical.",
      src: "/assets/img/Flora/Acacia.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Quiebrahacha, Palo de hierro ",
      especie: "Krugiodendron ferreum (Vahl) Urb. Rhamnaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol que en su madurez puede alcanzar hasta 10 m. de altura. De hojas ovales a aovadas, de 2 a 7 cm., obtusas o emarginadas. Flores verde-amarillentas. El fruto es una drupa globosa, de color negro al madurar, de 5 a 8 mm. La madera es de color pardo, veteada, muy dura, pesada y resistente. Se usa para postes de empalizadas, traviesas, pilotes para construcciones dentro del agua, leña y carbón. Nativa de las Antillas y América Central.",
      src: "/assets/img/Flora/Ferreum.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Escobón",
      especie: "Eugenia foetida. pers. Myrtaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto de hasta 8 m. de altura, con hojas de formas muy variables y pétalos color blanco. El fruto, una baya oval de color negro cuando madura, es consumido por las aves. Es melífera. Tiene uso mágico-religioso, para 'mejorar la suerte'. Nativa de las Antillas y la Florida.",
      src: "/assets/img/Flora/EugeniaFoe.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Guazuma, Guácima",
      especie: "Guazuma tomentosa H.B.K. Sterculiaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 15 m. de altura, de corteza color gris pardo, usualmente con hendiduras. Con hojas oblongas a anchamente aovadas, de 3 a 15 cm, agudas a largamente acuminadas, redondeadas a acorazonadas en la base, aserradas, estrelladas y tomentosas, (de pelos cortos y densos). Flores de color amarillo y fruto leñoso, comestible, ligeramente dulce, globoso u oval, de 2 a 3 cm. con numerosas semillas. Es buen forraje para el ganado. La corteza se usa en medicina popular para combatir diferentes dolencias. En algunos lugares se usa como seto vivo y como leña. Nativa de las Antillas y de América tropical continental.",
      src: "/assets/img/Flora/Guazuma.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Cafe cimarron ",
      especie: "Psychotria pubescens Sw. Rubiaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto de 3 mts, y a veces mas grande, con hojas elipticas a lanceo-oblongas, de 7 a 15 cm, acuminadas, pubescentes. Inflorescencia terminal con pocas flores, de corola color amarillo. El fruto es una drupa subglobosa de color negro, de 3 a 4 mm. que consumen las aves. Nativa de las Antillas.",
      src: "/assets/img/Flora/pubescens.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Copeyejo, Copeyito",
      especie: "Clusia minor L. Clusiaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto semitrepador de hasta 8 m, usualmente epifito en su etapa juvenil. Sus hojas son abovadas, obtusas o redondeadas, de 5 a 10 cm, muy coriáceas (duras y quebradizas). Flores con pétalos de color blanco o rosado. Su fruto es sub-globoso u ovoideo, de 1.5 a 2 cm. La madera es blanda, de color amarillo, veteada de rojizo claro. Tiene potencial ornamental. Nativa de las Antillas, excepto Jamaica, y de América continental tropical.",
      src: "/assets/img/Flora/Minor.jpeg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Macarabomba, Cabori",
      especie: "Casearia aculeata Jacq. Flacourtiaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbusto de hasta 4 m. de altura, que en sus ramas tiene a menudo espinas. De hojas elípticas, aovado-elípticas o lanceo-aovadas, de 4 a 7 cm, agudas a acuminadas, sub-enteras o aserrado-dentadas. Su fruto tiene formas globosa u ovoidea, de 6 a 8 mm. Su madera se utiliza para postes de empalizadas, y como leña y carbón. Muchas personas tienen la creencia de que la avispa nace de esta planta, lo que le ha dado uno de sus nombres comunes. Nativa de América tropical.",
      src: "/assets/img/Flora/jacq.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Cayuco",
      especie: "Pilosocereus polygonus (Lam.) Byles & Rowles Cactaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Planta carnosa que puede alcanzar más de 6 m. de altura, en forma columnar, ramificada con 5 a 13 costillas, con grupos de espinas llamadas areolas y lana gris cuando jóvenes. Las espinas miden de 1 a 1.5 cm, de color amarillo a gris. Sus flores son color blanco y su fruto globoso tiene numerosas semillas. Abunda en el bosque seco, en zonas cársticas y rocas calizas. Nativa de la Española y Cuba.",
      src: "/assets/img/Flora/pilo.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Caimito de perro",
      especie: "Chrysophyllum oliviforme L. Sapotaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol de hasta 10 m. de altura, de hojas elípticas u oblongas, brillosas, el envés densamente ferrugíneo o tomentoso, de color marrón y corola de color verde amarillento. Su fruto es una drupa elipsoide, comestible, jugosa. Crece en bosques húmedos y de transición. La decocción de las hojas se usa en la medicina popular contra inflamaciones. Su madera es de color pardo rojizo y se emplea para postes de empalizadas, y como leña y carbón. Es melífera. Nativa de las Antillas Mayores, Bahamas y Sur de los Estados Unidos.",
      src: "/assets/img/Flora/Chry.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "Limoncillo, Arrayan ",
      especie: "Calyptranthes pallens (Poir.) Griseb. Myrtaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Árbol dde hasta 10 m. de altura. De hojas elípticas a oblongo-elípticas, acuminadas, y flores de color amarillento. Su fruto, sub-globoso y oval, es algo insípido y lo comen algunos animales. La madera se usa para postes de empalizadas, en construcciones rurales y como leña.",
      src: "/assets/img/Flora/caly.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    /*{
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },  */

    // Agrega más imágenes si lo deseas...
  ];

  //Función para mezclar el array de imágenes (aleatorizar el orden)
  function mezclarArray(array) {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  // Aplica mezcla a las imágenes
  useEffect(() => {
    setImagenesMezcladas(mezclarArray(imagenes));
  }, []);

  const resultados = imagenesMezcladas.filter((img) => {
    const especieEsTodas = filtroEspecie === "" || filtroEspecie === "Todas";
    const habitatEsTodos = filtroHabitat === "" || filtroHabitat === "Todos";

    if (especieEsTodas && habitatEsTodos) {
      return true;
    }

    const especieMatch = especieEsTodas || img.tipo === filtroEspecie;

    // Normaliza tildes y mayúsculas para evitar errores
    const normalizar = (texto) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const filtroHabitatNormalizado = normalizar(filtroHabitat);

    const habitatMatch =
      habitatEsTodos ||
      (Array.isArray(img.habitat)
        ? img.habitat.some((h) => normalizar(h) === filtroHabitatNormalizado)
        : normalizar(img.habitat) === filtroHabitatNormalizado);

    return especieMatch && habitatMatch;
  });

  /*const hayFiltros = filtroEspecie || filtroHabitat; */

  return (
    <div className="page-wrapper">
      <main className="content">
        <div className="galeria-container">
          <button className="btn-salir" onClick={() => navigate("/")}>
            ← Volver al Inicio
          </button>

          <h1>Galería de Especies</h1>
          <p>
            Explora nuestras imágenes rotativas o filtra por especie/hábitat:
          </p>

          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="filter-tipo">Filtrar por especie</label>
              <select
                id="filter-tipo"
                onChange={(e) => setFiltroEspecie(e.target.value)}
              >
                <option value="Todas">Todas las especies</option>
                <option value="Fauna">Fauna</option>
                <option value="Flora">Flora</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-habitat">Filtrar por hábitat</label>
              <select
                id="filter-habitat"
                onChange={(e) => setFiltroHabitat(e.target.value)}
              >
                <option value="Todos">Todos los hábitats</option>
                <option value="Cueva">Cueva</option>
                <option value="Área Ácuatica">Área Ácuatica</option>
                <option value="Área Exterior">Área Exterior</option>
              </select>
            </div>
          </div>

          {/* {!hayFiltros ? (
            <div className="carousel-container">
              <Carrusel />
            </div>
          ) : ( */}
          <div className="resultados-grid">
            {resultados.length > 0 ? (
              resultados.map((img, idx) => (
                <div
                  className="result-card"
                  key={idx}
                  /*onClick={() => setEspecieSeleccionada(img)} */
                  onClick={() => setEspecieSeleccionada(img)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={img.src} alt={img.nombre} className="result-img" />
                  <h3>{img.nombre}</h3>
                  <p>
                    <strong>Especie:</strong> {img.especie}
                  </p>
                  <p>
                    <strong>Hábitat:</strong> {img.habitat}
                  </p>
                  {/*img.caracteristica && (
                      <p>
                        <strong>Características:</strong> {img.caracteristica}
                      </p>
                    ) */}
                </div>
              ))
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </div>
          {/* )} */}

          {/* Vista detallada al hacer clic */}
          {especieSeleccionada && (
            <div className="detalle-especie">
              <button
                className="btn-cerrar"
                onClick={() => setEspecieSeleccionada(null)}
              >
                X
              </button>
              <div className="detalle-contenido">
                <img
                  src={especieSeleccionada.src}
                  alt={especieSeleccionada.nombre}
                  className="imagen-detalle"
                />
                <h2>{especieSeleccionada.nombre}</h2>
                <p>
                  <strong>Nombre científico:</strong>{" "}
                  {especieSeleccionada.especie}
                </p>
                <p>
                  <strong>Hábitat:</strong> {especieSeleccionada.habitat}
                </p>
                {especieSeleccionada.caracteristica && (
                  <div className="caracteristica-scroll">
                    <strong>Características:</strong>
                    <p>{especieSeleccionada.caracteristica}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Galeria;
