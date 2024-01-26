const form = document.getElementById('form');
const progressBarTop = document.getElementById('progress-bar-inner-top');
const stepTitles = document.querySelectorAll('.step-title');

function updateProgressBar(step) {
    const totalSteps = 2; // Actualiza con la cantidad total de pasos
    const percentage = (step - 1) * (100 / totalSteps);

    progressBarTop.style.width = `${percentage}%`;
}


function updateStepTitles(step) {
    // Muestra solo los títulos de los pasos anteriores y el paso actual
    for (let i = 1; i <= 3; i++) {
        const stepTitle = document.getElementById(`step-title-${i}`);
        if (i <= step) {
            stepTitle.style.display = 'inline-block';
        } else {
            stepTitle.style.display = 'none';
        }
        if (i === step) {
            stepTitle.classList.add('active');
        } else {
            stepTitle.classList.remove('active');
        }
    }
}

function nextStep(step) {
    form.style.transform = `translateX(-${100 * (step - 1)}%)`;
    updateProgressBar(step);
    updateStepTitles(step);
}

function prevStep(step) {
    form.style.transform = `translateX(-${100 * (step - 1)}%)`;
    updateProgressBar(step);
    updateStepTitles(step);
}


// Asigna los eventos a los títulos del menú
stepTitles.forEach((title, index) => {
    title.addEventListener('click', () => {
        nextStep(index + 1);
    });
});
function validateStep1() {
    // Obtener todos los campos requeridos en el paso 1
    const requiredFields = document.querySelectorAll('#carnet, #expedido, #lugar-nacimiento, #fecha-nacimiento, #apellido-paterno, #apellido-materno, #nombres');

    let isValid = true;

    // Iterar sobre cada campo
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const validationMessage = field.getAttribute('data-required');

        // Eliminar cualquier mensaje de error existente
        removeErrorMessage(field);

        // Verificar si el campo está vacío
        if (value === '') {
            isValid = false;
            console.log(`Campo vacío: ${field.id}`);
            // Crear un elemento div para el mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = validationMessage;

            // Insertar el mensaje de error después del campo
            field.parentNode.appendChild(errorDiv);
        }
    });

    // Deshabilitar o habilitar el botón de Siguiente según la validación
    const nextButton = document.querySelector('.btn-navigation');
    nextButton.disabled = !isValid;

    // Si la validación es exitosa, avanzar al siguiente paso
    if (isValid) {
        console.log('Validación exitosa. Avanzando al siguiente paso...');
        nextStep(2);
    } else {
        console.log('La validación no fue exitosa. Asegúrate de completar todos los campos.');
    }

    return isValid;
}
function validateStep2() {
    // Obtener todos los campos requeridos en el paso 2
    const requiredFields = document.querySelectorAll('#departamento, #ciudad, #zona, #edu-institution, #study-level, #admission-year');

    let isValid = true;

    // Iterar sobre cada campo
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const validationMessage = field.getAttribute('data-required');
        removeErrorMessage(field);
        // Verificar si el campo está vacío
        if (value === '') {
            isValid = false;

            // Crear un elemento div para el mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = validationMessage;

            // Insertar el mensaje de error después del campo
            field.parentNode.appendChild(errorDiv);
        } else {
            // Si el campo se completa, eliminar cualquier mensaje de error existente
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    });

    // Deshabilitar o habilitar el botón de Siguiente según la validación
    const nextButton = document.querySelector('.btn-navigation');
    nextButton.disabled = !isValid;

    return isValid;
}
function validateStep3() {
    // Obtener todos los campos requeridos en el paso 3
    const requiredFields = document.querySelectorAll('#carnet-pmt, #expedido-pmt, #ocupacion-laboral, #parentesco, #apellido-paterno-pmt, #apellido-materno-pmt, #nombres-pmt, #direccion, #calular');

    let isValid = true;

    // Iterar sobre cada campo
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const validationMessage = field.getAttribute('data-required');

        // Verificar si el campo está vacío
        if (value === '') {
            isValid = false;

            // Crear un elemento div para el mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = validationMessage;

            // Insertar el mensaje de error después del campo
            field.parentNode.appendChild(errorDiv);
        } else {
            // Si el campo se completa, eliminar cualquier mensaje de error existente
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    });

    // Deshabilitar o habilitar el botón de Enviar según la validación
    const submitButton = document.querySelector('.btn-navigation[type="submit"]');
    submitButton.disabled = !isValid;

    return isValid;
}




function nextStep(step) {
    console.log('Avanzando al siguiente paso...');
    form.style.transform = `translateX(-${100 * (step - 1)}%)`;
    updateProgressBar(step);
    updateStepTitles(step);
}

// Función para eliminar el mensaje de error
function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}



document.addEventListener('DOMContentLoaded', function () {
    // Oculta los títulos de los pasos 2, 3 y 4 al cargar la página
    for (let i = 2; i <= 3; i++) {
        const stepTitle = document.getElementById(`step-title-${i}`);
        stepTitle.style.display = 'none';
    }
    
// Mapeo de unidades educativas a latitud y longitud
    const locations = {
        "MÓDULO EDUCATIVO MUNICIPAL LUZ Y SABER": { latitude: -17.736333067818897, longitude: -63.14833438234318 },
        "Unidad Educativa 2": { latitude: -17.780123, longitude: -63.200456 },
        // Agrega más ubicaciones según sea necesario
    };

    const defaultLocation = { latitude: -17.7750421, longitude: -63.194864 };
    
    // Obtener elementos de las listas desplegables
    const institutionDropdown = document.getElementById("edu-institution");

    // Añadir event listener para el cambio en la unidad educativa
    institutionDropdown.addEventListener("change", updateMap);

    // Función para actualizar el mapa según la unidad educativa seleccionada
    function updateMap() {
        const selectedInstitution = institutionDropdown.value;
        const location = locations[selectedInstitution] || defaultLocation;

        const latitude = location.latitude;
        const longitude = location.longitude;
        const zoomLevel = 17;
        const apiKey = "AIzaSyDkfU0m0MkC2UTdAtGBLNlrrIC5nsI14FE"; // Reemplaza con tu clave de API de Google Maps

        const googleMapsUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=${zoomLevel}&maptype=roadmap`;
        
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", googleMapsUrl);
        iframe.setAttribute("width", "350");
        iframe.setAttribute("height", "230");
        iframe.setAttribute("style", "border:0;");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("loading", "lazy");
        // Actualizar el iframe del mapa
// Obtén el contenedor del mapa
const mapContainer = document.getElementById("map-container");

// Limpia el contenido actual del contenedor
mapContainer.innerHTML = '';

// Agrega el nuevo iframe al contenedor
mapContainer.appendChild(iframe);
    }

    // Llama a la función de actualización al cargar la página
    updateMap();
});
// Define las opciones para las ciudades y zonas por departamento
const citiesByDepartment = {
    ch: ["Sucre", "Yotala", "Zudañez", "Camargo", "Villa Abecia", "Tomina", "Presto", "Padilla", "Monteagudo", "Macharetí", "Mojocoya", "Icla", "Villa Charcas", "Tarabuco", "Yamparáez", "Culpina", "San Lucas", "Sopachuy"],
    lpz: ["La Paz", "Achocalla", "El Alto", "Viacha", "Mecapaca", "Palca", "Copacabana", "Coroico", "Puerto Acosta", "Desaguadero", "Apolo", "Guanay", "Sorata", "Caranavi", "Chulumani", "Irpavi", "Patacamaya"],
    or: ["Oruro", "Caracollo", "Huanuni", "Machacamarca", "El Choro", "Corque", "Challapata", "Huachacalla", "Soracachi", "Coripata"],
    pn: ["Cobija", "Bolpebra", "Filtraciones", "Porvenir", "Santa Rosa"],
    pt: ["Potosí", "Uyuni", "Villazón", "Tupiza", "Llallagua", "Uncía", "Villa de Yocalla", "Challapata", "Cotagaita", "Colquechaca", "Betanzos", "Tinguipaya"],
    scz: ["Santa Cruz de la Sierra", "Montero", "Warnes", "Cotoca", "San Ignacio de Velasco", "San José de Chiquitos", "Concepción", "Camiri", "Buena Vista", "Ascensión de Guarayos", "Comarapa", "Yapacaní", "Portachuelo", "El Torno", "La Guardia", "Okinawa II", "Pailón", "Puerto Suárez"],
    tj: ["Tarija", "Yacuiba", "Bermejo", "Villamontes", "Entre Ríos", "Padcaya", "Uriondo", "El Puente"],
    bn: ["Trinidad", "Riberalta", "Guayaramerín", "Cobija", "Rurrenabaque", "Santa Ana del Yacuma", "San Borja", "Magdalena", "Baures", "San Ramón"],
    cb: ["Cochabamba", "Quillacollo", "Sacaba", "Colcapirhua", "Tiquipaya", "Vinto", "Punata", "Cliza", "Arani", "Arque", "Aiquile", "Totora", "Tarata", "Anzaldo", "Capinota", "Santiváñez", "Villa Ichilo"],
 /*orden alfabetico 
 ch: ["Camargo", "Culpina", "Icla", "Macharetí", "Mojocoya", "Monteagudo", "Padilla", "Presto", "San Lucas", "Sucre", "Sopachuy", "Tarabuco", "Tomina", "Villa Abecia", "Villa Charcas", "Yamparáez", "Yotala", "Zudañez"],
lpz: ["Achocalla", "Apolo", "Caranavi", "Caranavi", "Chulumani", "Copacabana", "Coroico", "Desaguadero", "El Alto", "Guanay", "Irpavi", "La Paz", "Mecapaca", "Palca", "Patacamaya", "Puerto Acosta", "Sorata", "Viacha"],
or: ["Caracollo", "Challapata", "Coripata", "Corque", "El Choro", "Huachacalla", "Huanuni", "Machacamarca", "Oruro", "Soracachi"],
pn: ["Bolpebra", "Cobija", "Filtraciones", "Porvenir", "Santa Rosa"],
pt: ["Betanzos", "Challapata", "Colquechaca", "Cotagaita", "Llallagua", "Potosí", "Tinguipaya", "Tupiza", "Uyuni", "Uncía", "Villa de Yocalla", "Villazón"],
scz: ["Ascensión de Guarayos", "Buena Vista", "Camiri", "Comarapa", "Concepción", "Cotoca", "El Torno", "La Guardia", "Montero", "Okinawa II", "Pailón", "Portachuelo", "Puerto Suárez", "San Ignacio de Velasco", "San José de Chiquitos", "Santa Cruz de la Sierra", "Warnes", "Yapacaní"],
tj: ["Bermejo", "El Puente", "Entre Ríos", "Padcaya", "Tarija", "Uriondo", "Villamontes", "Yacuiba"],
bn: ["Baures", "Cobija", "Guayaramerín", "Magdalena", "Riberalta", "Rurrenabaque", "San Ana del Yacuma", "San Borja", "San Ramón", "Trinidad"],
cb: ["Aiquile", "Anzaldo", "Arani", "Arque", "Capinota", "Cochabamba", "Cliza", "Colcapirhua", "Punata", "Quillacollo", "Sacaba", "Santiváñez", "Tarata", "Tiquipaya", "Totora", "Villa Ichilo", "Vinto"],

 */  
    // Agrega el resto de las opciones según sea necesario
};

const districtsByCity = {
    "Sucre": ["Zona 1", "Zona 2", "Zona 3"],
  "Yotala": ["Zona A", "Zona B", "Zona C"],
  "Zudañez": ["Distrito Norte", "Distrito Sur", "Distrito Central"],
  "Camargo": ["Área Este", "Área Oeste", "Área Central"],
  "Villa Abecia": ["Sector 1", "Sector 2", "Sector 3"],
  "Tomina": ["Distrito A", "Distrito B", "Distrito C"],
  "Presto": ["Zona Este", "Zona Oeste", "Zona Central"],
  "Padilla": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Monteagudo": ["Zona 1", "Zona 2", "Zona 3"],
  "Macharetí": ["Distrito A", "Distrito B", "Distrito C"],
  "Mojocoya": ["Área 1", "Área 2", "Área 3"],
  "Icla": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Villa Charcas": ["Sector Este", "Sector Oeste", "Sector Central"],
  "Tarabuco": ["Zona A", "Zona B", "Zona C"],
  "Yamparáez": ["Distrito Norte", "Distrito Sur", "Distrito Central"],
  "Culpina": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "San Lucas": ["Zona Este", "Zona Oeste", "Zona Central"],
  "Sopachuy": ["Área 1", "Área 2", "Área 3"],

  "La Paz": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Achocalla": ["Área Este", "Área Oeste", "Área Central"],
  "El Alto": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Viacha": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Mecapaca": ["Zona A", "Zona B", "Zona C"],
  "Palca": ["Sector 1", "Sector 2", "Sector 3"],
  "Copacabana": ["Área Norte", "Área Sur", "Área Central"],
  "Coroico": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Puerto Acosta": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "Desaguadero": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Apolo": ["Área 1", "Área 2", "Área 3"],
  "Guanay": ["Zona A", "Zona B", "Zona C"],
  "Sorata": ["Distrito Norte", "Distrito Sur", "Distrito Central"],
  "Caranavi": ["Sector Este", "Sector Oeste", "Sector Central"],
  "Chulumani": ["Barrio 1", "Barrio 2", "Barrio 3"],
  "Irpavi": ["Zona Este", "Zona Oeste", "Zona Central"],
  "Patacamaya": ["Área Norte", "Área Sur", "Área Central"],
  "Puerto Acosta": ["Distrito Este", "Distrito Oeste", "Distrito Central"],

  "Oruro": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Caracollo": ["Área Este", "Área Oeste", "Área Central"],
  "Huanuni": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Machacamarca": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "El Choro": ["Zona A", "Zona B", "Zona C"],
  "Corque": ["Sector 1", "Sector 2", "Sector 3"],
  "Challapata": ["Área Norte", "Área Sur", "Área Central"],
  "Huachacalla": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Soracachi": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "Coripata": ["Zona Norte", "Zona Sur", "Zona Central"],

  "Cobija": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Bolpebra": ["Área Este", "Área Oeste", "Área Central"],
  "Filtraciones": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Porvenir": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Santa Rosa": ["Zona A", "Zona B", "Zona C"],

  "Potosí": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Uyuni": ["Área Este", "Área Oeste", "Área Central"],
  "Villazón": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Tupiza": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Llallagua": ["Zona A", "Zona B", "Zona C"],
  "Uncía": ["Sector 1", "Sector 2", "Sector 3"],
  "Villa de Yocalla": ["Área Norte", "Área Sur", "Área Central"],
  "Challapata": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Cotagaita": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "Colquechaca": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Betanzos": ["Sector Este", "Sector Oeste", "Sector Central"],
  "Tinguipaya": ["Barrio 1", "Barrio 2", "Barrio 3"],

  "Santa Cruz de la Sierra": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Montero": ["Área Este", "Área Oeste", "Área Central"],
  "Warnes": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Cotoca": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "San Ignacio de Velasco": ["Zona A", "Zona B", "Zona C"],
  "San José de Chiquitos": ["Sector 1", "Sector 2", "Sector 3"],
  "Concepción": ["Área Norte", "Área Sur", "Área Central"],
  "Camiri": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Buena Vista": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "Ascensión de Guarayos": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Comarapa": ["Área Este", "Área Oeste", "Área Central"],
  "Yapacaní": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Portachuelo": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "El Torno": ["Zona A", "Zona B", "Zona C"],
  "La Guardia": ["Sector 1", "Sector 2", "Sector 3"],
  "Okinawa II": ["Área Norte", "Área Sur", "Área Central"],
  "Pailón": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Puerto Suárez": ["Barrio Este", "Barrio Oeste", "Barrio Central"],

  "Tarija": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Yacuiba": ["Área Este", "Área Oeste", "Área Central"],
  "Bermejo": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Villamontes": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Entre Ríos": ["Zona A", "Zona B", "Zona C"],
  "Padcaya": ["Sector 1", "Sector 2", "Sector 3"],
  "Uriondo": ["Área Norte", "Área Sur", "Área Central"],
  "El Puente": ["Distrito Este", "Distrito Oeste", "Distrito Central"],

  "Trinidad": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Riberalta": ["Área Este", "Área Oeste", "Área Central"],
  "Guayaramerín": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Cobija": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Rurrenabaque": ["Zona A", "Zona B", "Zona C"],
  "Santa Ana del Yacuma": ["Sector 1", "Sector 2", "Sector 3"],
  "San Borja": ["Área Norte", "Área Sur", "Área Central"],
  "Magdalena": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Baures": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "San Ramón": ["Zona Norte", "Zona Sur", "Zona Central"],

  "Cochabamba": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Quillacollo": ["Área Este", "Área Oeste", "Área Central"],
  "Sacaba": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Colcapirhua": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Tiquipaya": ["Zona A", "Zona B", "Zona C"],
  "Vinto": ["Sector 1", "Sector 2", "Sector 3"],
  "Punata": ["Área Norte", "Área Sur", "Área Central"],
  "Cliza": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
  "Arani": ["Barrio Este", "Barrio Oeste", "Barrio Central"],
  "Arque": ["Zona Norte", "Zona Sur", "Zona Central"],
  "Aiquile": ["Área Este", "Área Oeste", "Área Central"],
  "Totora": ["Distrito 1", "Distrito 2", "Distrito 3"],
  "Tarata": ["Barrio Norte", "Barrio Sur", "Barrio Central"],
  "Anzaldo": ["Zona A", "Zona B", "Zona C"],
  "Capinota": ["Sector 1", "Sector 2", "Sector 3"],
  "Santiváñez": ["Área Norte", "Área Sur", "Área Central"],
  "Villa Ichilo": ["Distrito Este", "Distrito Oeste", "Distrito Central"],
};
const schoolsByDistrict = {
    "Zona Norte": ["MÓDULO EDUCATIVO MUNICIPAL LUZ Y SABER","Escuela 1", "Escuela 2", "Escuela 3"],
    // ... otras escuelas por distrito
};

const levelsBySchool = {
    "Escuela 1": ["Inicial", "Primaria", "Secundaria"],
    "MÓDULO EDUCATIVO MUNICIPAL LUZ Y SABER": ["Primaria", "Secundaria"],
    // ... otros niveles por escuela
};

const yearsByLevel = {
    "Inicial": ["1ro", "2do"],
    "Primaria": ["1ro", "2do", "3ro", "4to", "5to", "6to"],
    "Secundaria": ["1ro", "2do", "3ro", "4to", "5to", "6to"],
    // ... otros años por nivel
};

// Obtener elementos de las listas desplegables
const departmentDropdown = document.getElementById("departamento");
const cityDropdown = document.getElementById("ciudad");
const districtDropdown = document.getElementById("zona");
const schoolDropdown = document.getElementById("edu-institution");
const levelDropdown = document.getElementById("study-level");
const yearDropdown = document.getElementById("admission-year");

// Añadir event listener para el cambio en el departamento
departmentDropdown.addEventListener("change", updateCities);

// Añadir event listener para el cambio en la ciudad
cityDropdown.addEventListener("change", updateDistricts);

// Añadir event listener para el cambio en el distrito
districtDropdown.addEventListener("change", updateSchools);

// Añadir event listener para el cambio en la escuela
schoolDropdown.addEventListener("change", updateLevels);

// Añadir event listener para el cambio en el nivel
levelDropdown.addEventListener("change", updateYears);

// Función para actualizar las opciones de ciudad según el departamento seleccionado
function updateCities() {
    const selectedDepartment = departmentDropdown.value;
    const cities = citiesByDepartment[selectedDepartment];

    // Limpiar opciones actuales
    cityDropdown.innerHTML = "<option value=''>Seleccionar</option>";
    districtDropdown.innerHTML = "<option value=''>Seleccionar</option>";

    // Agregar las nuevas opciones
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });
    updateDistricts();
}

// Función para actualizar las opciones de zona según la ciudad seleccionada
function updateDistricts() {
    const selectedCity = cityDropdown.value;
    const districts = districtsByCity[selectedCity];

    // Limpiar opciones actuales
    districtDropdown.innerHTML = "<option value=''>Seleccionar</option>";

    // Agregar las nuevas opciones
    districts.forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtDropdown.appendChild(option);
    });
    updateSchools();
}

// Función para actualizar las opciones de las escuelas según el distrito
function updateSchools() {
    const selectedDistrict = districtDropdown.value;
    const schools = schoolsByDistrict[selectedDistrict];

    // Limpiar opciones actuales
    schoolDropdown.innerHTML = "<option value=''>Seleccionar</option>";

    // Agregar nuevas opciones
    schools.forEach(school => {
        const option = document.createElement("option");
        option.value = school;
        option.textContent = school;
        schoolDropdown.appendChild(option);
    });

    // Llamar a la función para actualizar los niveles
    updateLevels();
}

// Función para actualizar las opciones de los niveles según la escuela
function updateLevels() {
    const selectedSchool = schoolDropdown.value;
    const levels = levelsBySchool[selectedSchool];

    // Limpiar opciones actuales
    levelDropdown.innerHTML = "<option value=''>Seleccionar</option>";

    // Agregar nuevas opciones
    levels.forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        levelDropdown.appendChild(option);
    });

    // Llamar a la función para actualizar los años
    updateYears();
}

// Función para actualizar las opciones de los años según el nivel
function updateYears() {
    const selectedLevel = levelDropdown.value;
    const years = yearsByLevel[selectedLevel];

    // Limpiar opciones actuales
    yearDropdown.innerHTML = "<option value=''>Seleccionar</option>";

    // Agregar nuevas opciones
    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });
}

// Llama a la función de actualización al cargar la página
updateCities();

function mostrarDatos() {
    var carnet = document.getElementById('carnet').value;
    var expedido = document.getElementById('expedido').value;
    var lugarNacimiento = document.getElementById('lugar-nacimiento').value;
    var fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    var apellidoPaterno = document.getElementById('apellido-paterno').value;
    var apellidoMaterno = document.getElementById('apellido-materno').value;
    var nombres = document.getElementById('nombres').value;
    var departamento = document.getElementById('departamento').value;
    var ciudad = document.getElementById('ciudad').value;
    var zona = document.getElementById('zona').value;
    var eduInstitution = document.getElementById('edu-institution').value;
    var studyLevel = document.getElementById('study-level').value;
    var admissionYear = document.getElementById('admission-year').value;
    var carnetPmt = document.getElementById('carnet-pmt').value;
    var expedidoPmt = document.getElementById('expedido-pmt').value;
    var ocupacionLaboral = document.getElementById('ocupacion-laboral').value;
    var parentesco = document.getElementById('parentesco').value;
    var apellidoPaternoPmt = document.getElementById('apellido-paterno-pmt').value;
    var apellidoMaternoPmt = document.getElementById('apellido-materno-pmt').value;
    var nombresPmt = document.getElementById('nombres-pmt').value;
    var direccion = document.getElementById('direccion').value;
    var celular = document.getElementById('celular').value;

    document.getElementById('carnet-container').innerText = 'Número de Carnet: ' + carnet;
    document.getElementById('expedido-container').innerText = 'Expedido en: ' + expedido;
    document.getElementById('lugar-nacimiento-container').innerText = 'Lugar de Nacimiento: ' + lugarNacimiento;
    document.getElementById('fecha-nacimiento-container').innerText = 'Fecha de Nacimiento: ' + fechaNacimiento;
    document.getElementById('apellido-paterno-container').innerText = 'Apellido Paterno: ' + apellidoPaterno;
    document.getElementById('apellido-materno-container').innerText = 'Apellido Materno: ' + apellidoMaterno;
    document.getElementById('nombres-container').innerText = 'Nombre(s): ' + nombres;
    document.getElementById('departamento-container').innerText = 'Departamento: ' + departamento;
    document.getElementById('ciudad-container').innerText = 'Ciudad: ' + ciudad;
    document.getElementById('zona-container').innerText = 'Zona/Distrito: ' + zona;
    document.getElementById('edu-institution-container').innerText = 'Unidades Educativas: ' + eduInstitution;
    document.getElementById('study-level-container').innerText = 'Nivel de Estudio: ' + studyLevel;
    document.getElementById('admission-year-container').innerText = 'Año al que postula: ' + admissionYear;
    document.getElementById('carnet-pmt-container').innerText = 'Número de Carnet (Padre/Madre/Tutor): ' + carnetPmt;
    document.getElementById('expedido-pmt-container').innerText = 'Expedido en (Padre/Madre/Tutor): ' + expedidoPmt;
    document.getElementById('ocupacion-laboral-container').innerText = 'Ocupación Laboral (Padre/Madre/Tutor): ' + ocupacionLaboral;
    document.getElementById('parentesco-container').innerText = 'Parentesco: ' + parentesco;
    document.getElementById('apellido-paterno-pmt-container').innerText = 'Apellido Paterno (Padre/Madre/Tutor): ' + apellidoPaternoPmt;
    document.getElementById('apellido-materno-pmt-container').innerText = 'Apellido Materno (Padre/Madre/Tutor): ' + apellidoMaternoPmt;
    document.getElementById('nombres-pmt-container').innerText = 'Nombre(s) (Padre/Madre/Tutor): ' + nombresPmt;
    document.getElementById('direccion-container').innerText = 'Dirección de Residencia: ' + direccion;
    document.getElementById('celular-container').innerText = 'Número Celular: ' + celular;

    // Redirigir a la página de mostrar-datos.html
    window.location.href = 'mostrar-datos.html';
}
