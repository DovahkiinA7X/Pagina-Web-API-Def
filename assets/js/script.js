// Se seleccionan elementos del DOM a usarse
const personagesSection = document.querySelector(".personages");
const detalleSection = document.getElementById("personaje-detalle");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const filtroSelect = document.getElementById("filtro");

// URL de la API donde obtenemos todos los personajes
const apiURL = "https://akabab.github.io/superhero-api/api/all.json";

let personajesFiltrados = [];

// Obtiene todos los personajes desde la API
async function getPersonages() {
  const res = await fetch(apiURL);
  const personages = await res.json();
  return personages;
}

// Función que renderiza los personajes en la página
async function renderPersonages(filtro = "todos", texto = "") {
  const personages = await getPersonages();

   // Se diltran solo personajes de DC Comics y se excluyen algunos erróneos
  const dcCharacters = personages.filter(p =>
    p.biography.publisher === "DC Comics" &&
    !["Ben 10", "Chameleon", "Kevin 11"].includes(p.name)
  );

  // Mostrar un botón al hacer scroll hacia abajo
  window.addEventListener('scroll', () => {
    const scrollButton = document.getElementById('scrollToTop');
    if (window.scrollY > 400) {
      scrollButton.style.display = 'block';
    } else {
      scrollButton.style.display = 'none';
    }
  });

  // Volver al inicio al hacer click
  document.getElementById('scrollToTop').addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  // Aqui se agregan personajes manualmente (Que no aparecen en la API)

  dcCharacters.push({ // Esto agrega el nuevo personaje al final de la lista
    id: 1000,
    name: "Red Hood",
    biography: {
      fullName: "Jason Todd",
      publisher: "DC Comics",
      alignment: "neutral"
    },
    appearance: {
      gender: "male"
    },
    work: {
      occupation: "Vigilante, ex-Robin"
    },
    images: {
      sm: "https://i.pinimg.com/736x/b1/f3/c1/b1f3c167558edb15558ef60fd083fe02.jpg",
      lg: "https://i.pinimg.com/736x/b1/f3/c1/b1f3c167558edb15558ef60fd083fe02.jpg"
    }
  });

  dcCharacters.push({ // Aquí se crea el HTML para mostrar los personajes
    id: 1001,
    name: "Hush",
    biography: {
      fullName: "Thomas Elliot",
      publisher: "DC Comics",
      alignment: "bad"
    },
    appearance: {
      gender: "male"
    },
    work: {
      occupation: "Neurosurgeon, criminal mastermind"
    },
    images: {
      sm: "https://i.redd.it/sdyh7huxnmga1.jpg",
      lg: "https://i.redd.it/sdyh7huxnmga1.jpg"
    }
  });

  dcCharacters.push({ // Aquí se crea el HTML para mostrar los personajes
    id: 1002,
    name: "Black Mask",
    biography: {
      fullName: "Roman Sionis",
      publisher: "DC Comics",
      alignment: "bad"
    },
    appearance: {
      gender: "male"
    },
    work: {
      occupation: "Crime lord, Organized crime leader"
    },
    images: {
      sm: "https://i.pinimg.com/736x/7d/f9/20/7df9203b6a33e84c770ffe726afb6ea2.jpg",
      lg: "https://i.pinimg.com/736x/7d/f9/20/7df9203b6a33e84c770ffe726afb6ea2.jpg"
    }
  });

  // Ordenar alfabéticamente por nombre (Ordena todos los personajes para que los nuevos se mezclen correctamente y no queden al final)
  dcCharacters.sort((a, b) => a.name.localeCompare(b.name));

  personajesFiltrados = dcCharacters.filter(p => {
    const coincideFiltro = filtro === "todos" || p.biography.alignment === filtro;
    const coincideBusqueda = p.name.toLowerCase().includes(texto);
    return coincideFiltro && coincideBusqueda;
  });


  // Aquí se crea el HTML para mostrar los personajes
  let template = "";

  // Se recorren los personajes filtrados y se crean las tarjetas de cada uno
  personajesFiltrados.forEach((personage) => {
    let imageUrl = personage.images.sm;

    // Reemplaza con imágenes personalizadas algunas imagenes de la Api (Algunos imagenes no aparecian o estaban de muy mala calidad)
    if (personage.name === "Gog") {
      imageUrl = "https://www.superherodb.com/pictures2/portraits/10/050/693.jpg?v=1617235200";
    } else if (personage.name === "Alan Scott") {
      imageUrl = "https://i0.wp.com/cinemedios.com/wp-content/uploads/2021/10/248023096_4420428804659973_369535677159489219_n.jpg?ssl=1";
    } else if (personage.name === "Deathstroke") {
      imageUrl = "https://i.pinimg.com/736x/78/c7/3f/78c73f0fa3a191387966d11b24dcd7b2.jpg";
    } else if (personage.name === "Deadshot") {
      imageUrl = "https://i.pinimg.com/736x/df/33/7b/df337be7ca04918ad5733c03e485f4f4.jpg";
    } else if (personage.name === "Mister Freeze") {
      imageUrl = "https://i0.wp.com/tomatazos.buscafs.com/2025/03/i-love-all-the-frames-of-mr-freeze-staring-at-his-wife-v0-f0kkz4ycnkq81.webp?quality=75&strip=all";
    } else if (personage.name === "Scarecrow") {
      imageUrl = "https://i.pinimg.com/736x/69/c5/df/69c5df297861db9770d870d1177cc6ef.jpg";
    } else if (personage.name === "Penguin") {
      imageUrl = "https://i.pinimg.com/736x/14/e7/d2/14e7d2d1290e7f3fa7f5f006aa24ecf0.jpg";
    } else if (personage.name === "Mister Zsasz") {
      imageUrl = "https://upload.wikimedia.org/wikipedia/en/d/d6/Victor_Zsasz_%28StreetsOfGotham4%29.jpg";
    }

    // Se crea el HTML para cada personaje
    template += `
      <div class="personage" data-id="${personage.id}">
        <img src="${imageUrl}" alt="${personage.name}" />
        <h3>${personage.name}</h3>
        <p>${personage.biography.fullName || "Unknown"}</p>
      </div>
    `;
  });

  personagesSection.innerHTML = template;

  // Evento de click a cada tarjeta para mostrar su modal

  document.querySelectorAll(".personage").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-id");
      const personaje = personajesFiltrados.find(p => p.id == id);
      mostrarDetalle(personaje);
    });
  });
}

// Función para mostrar los detalles de cada personaje en su modal
function mostrarDetalle(personaje) {
  let imageUrl = personaje.images.lg;

  // Algunos cambios a la informacion erronea de ciertos personajes en su modal
  if (personaje.name === "Batman") {
    personaje.work.occupation = "Businessman, Detective, Gotham Vigilante";
  } if (personaje.name === "Gog") {
    imageUrl = "https://www.superherodb.com/pictures2/portraits/10/050/693.jpg?v=1617235200";
  } else if (personaje.name === "Alan Scott") {
    imageUrl = "https://i0.wp.com/cinemedios.com/wp-content/uploads/2021/10/248023096_4420428804659973_369535677159489219_n.jpg?ssl=1";
  } else if (personaje.name === "Deathstroke") {
    imageUrl = "https://i.pinimg.com/736x/78/c7/3f/78c73f0fa3a191387966d11b24dcd7b2.jpg";
  } else if (personaje.name === "Deadshot") {
    imageUrl = "https://i.pinimg.com/736x/df/33/7b/df337be7ca04918ad5733c03e485f4f4.jpg";
    personaje.work.occupation = " Contract killer and the world's best marksman"
  } else if (personaje.name === "Mister Freeze") {
    imageUrl = "https://i0.wp.com/tomatazos.buscafs.com/2025/03/i-love-all-the-frames-of-mr-freeze-staring-at-his-wife-v0-f0kkz4ycnkq81.webp?quality=75&strip=all";
  } else if (personaje.name === "Scarecrow") {
    imageUrl = "https://i.pinimg.com/736x/69/c5/df/69c5df297861db9770d870d1177cc6ef.jpg";
  } else if (personaje.name === "Penguin") {
    imageUrl = "https://i.pinimg.com/736x/14/e7/d2/14e7d2d1290e7f3fa7f5f006aa24ecf0.jpg";
  } else if (personaje.name === "Mister Zsasz") {
    imageUrl = "https://upload.wikimedia.org/wikipedia/en/d/d6/Victor_Zsasz_%28StreetsOfGotham4%29.jpg";
  }
  // Detalles de la informacion que aparece en el modal de cada personaje
  detalleSection.innerHTML = `
    <h2>${personaje.name}</h2>
    <img src="${imageUrl}" alt="${personaje.name}" style="width:100%;" /> 
    <p><strong>Name:</strong> ${personaje.biography.fullName || "Unknown"}</p>
    <p><strong>Publisher:</strong> ${personaje.biography.publisher}</p>
    <p><strong>Role:</strong>
  ${personaje.biography.alignment === "good"
      ? '<span class="badge bg-success">Hero</span>'
      : personaje.biography.alignment === "bad"
        ? '<span class="badge bg-danger">Villain</span>'
        : '<span class="badge bg-secondary">Neutral</span>'
    }
</p>
    <p><strong>Genre:</strong> ${personaje.appearance.gender === "male" ? "Male" : personaje.appearance.gender === "female" ? "Female" : personaje.appearance.gender}</p>
    <p><strong>Occupation:</strong> ${personaje.work.occupation || "Unknown"}</p>
  `;

  // Se muestra el modal luego de hacer click
  modal.classList.remove("hidden");
}

// Se cierra el modal al hacer click en el botón de cerrar
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

filtroSelect.addEventListener("change", () => {
  renderPersonages(filtroSelect.value);
});

const buscador = document.getElementById("buscador");

// Barra de busqueda para los personajes
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filtro = filtroSelect.value;
  renderPersonages(filtro, texto);
});

const clearBtn = document.getElementById("clear-btn");

buscador.addEventListener("input", () => {
  clearBtn.style.display = buscador.value ? "inline" : "none";
});

// Evento de click para limpiar la búsqueda y resetear el filtro
clearBtn.addEventListener("click", () => {
  buscador.value = "";
  clearBtn.style.display = "none";
  renderPersonages(filtroSelect.value, "");
});
// Aqui se llama a la función para mostrar a todos los personajes al cargar la página
renderPersonages();