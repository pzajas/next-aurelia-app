import type { Bilingual } from "./types";

const b = (pl: string, en: string): Bilingual => ({ pl, en });

export const copy = {
  meta: {
    title: b(
      "Aurelia — Prywatne Atelier Fryzjerskie",
      "Aurelia — Maison de Coiffure"
    ),
    description: b(
      "Włosy jako forma sztuki. Edytorskie cięcia, autorska koloryzacja i rytuały pielęgnacji.",
      "The Art of Hair. Editorial cuts, colour architecture, and transformation rituals in Paris."
    ),
  },

  intro: {
    atelier: b("Prywatne Atelier Fryzjerskie", "Private Hair Atelier"),
    sequence: b("Rozpoczęcie sesji", "Session sequence"),
  },

  nav: {
    atelier: b("Atelier", "Atelier"),
    journal: b("Journal", "Journal"),
    disciplines: b("Dyscypliny", "Disciplines"),
    archive: b("Archiwum", "Archive"),
    stories: b("Historie", "Stories"),
    contact: b("Kontakt", "Contact"),
    commission: b("Projekty Specjalne", "Commission"),
    requestAppointment: b("Umów Konsultację", "Request Appointment"),
    menu: b("Menu", "Menu"),
    close: b("Zamknij", "Close"),
    ctaSubline: b(
      "Prywatna konsultacja atelier",
      "Private atelier consultation"
    ),
    editionMark: b("ÉDITION MMXXVI", "ÉDITION MMXXVI"),
  },

  hero: {
    edition: b("Nr 1 — Est. MMXIV", "No. 1 — Est. MMXIV"),
    tagline: b("Włosy jako forma sztuki.", "The Art of Hair."),
    subtitle: b("Prywatne Atelier Fryzjerskie", "Maison de Coiffure"),
    appointmentOnly: b(
      "Wyłącznie po wcześniejszej rezerwacji",
      "By Appointment Only"
    ),
  },

  prestige: {
    label: b("UZNANIE — SEZON 2024", "RECOGNITION — SAISON 2024"),
    stats: [
      {
        label: b("Lata Doświadczenia", "Years of Mastery"),
      },
      {
        label: b("Transformacje", "Transformations"),
      },
      {
        label: b("Nagrody Międzynarodowe", "International Awards"),
      },
    ],
  },

  founder: {
    locations: b(
      "PARYŻ · MAYFAIR · NOWY JORK",
      "PARIS · MAYFAIR · NEW YORK"
    ),
    viewMember: b("Zobacz", "View"),
    team: [
      {
        label: b("ATELIER / ZAŁOŻYCIELKA", "ATELIER / FOUNDER"),
        role: b("Założycielka Aurelia Paris", "Founder of Aurelia Paris"),
        quote: b(
          "Włosy to architektura w ruchu. Każda sylwetka, którą tworzę, ma odsłaniać tożsamość — nie ukrywać jej. Forma porusza się razem z Tobą.",
          "Hair is architecture in motion. Every silhouette I create is designed to reveal identity, not conceal it. Form moves with you."
        ),
      },
      {
        label: b("ATELIER / KOLOR", "ATELIER / COLOUR"),
        role: b(
          "Dyrektorka Koloryzacji Atelier",
          "Directrice of Colour Architecture"
        ),
        quote: b(
          "Kolor to światło uczynione widzialnym. Rzeźbimy ton tak, jak atelier rzeźbi formę — z powściągliwością, intencją i ciszą między odcieniami.",
          "Colour is light made legible. We sculpt tone the way an atelier sculpts form — with restraint, intention, and silence between the shades."
        ),
      },
      {
        label: b("ATELIER / CIĘCIE", "ATELIER / CUT"),
        role: b("Dyrektor Artystycznych Cięć", "Master of Editorial Cut"),
        quote: b(
          "Linia powinna wydawać się nieunikniona. Najlepsze cięcie znika — pozostaje jedynie sylwetka, która mówi sama za siebie, bez zbędnych słów.",
          "A line should feel inevitable. The best cut disappears — only the silhouette remains, speaking on its own without unnecessary words."
        ),
      },
      {
        label: b("ATELIER / RYTUAŁ", "ATELIER / RITUAL"),
        role: b(
          "Dyrektorka Rytuału i Odbudowy",
          "Director of Ritual & Restoration"
        ),
        quote: b(
          "Odbudowa to ceremonia. Każda sesja jest cichą negocjacją między pamięcią, teksturą i tym, czym włosy są gotowe się stać. Czas jest naszym narzędziem.",
          "Restoration is ceremony. Every session is a quiet negotiation between memory, texture, and what the hair is ready to become. Time is our instrument."
        ),
      },
    ],
  },

  manifesto: {
    label: b(
      "MANIFESTO — KIERUNEK ARTYSTYCZNY",
      "MANIFESTO — ARTISTIC DIRECTION"
    ),
    lines: [
      b("„Włosy nie są ozdobą.", "“Hair is not decoration."),
      b("Są deklaracją.", "It is declaration."),
      b(
        "Każda forma jest świadomym wyborem —",
        "Every form is a conscious choice —"
      ),
      b("między tym, kim jesteś,", "between who you are,"),
      b("a tym, kim się stajesz.”", "and who you are becoming.”"),
    ],
    attribution: b(
      "— Sofia Renault, Dyrektorka Artystyczna",
      "— Sofia Renault, Directrice Artistique"
    ),
  },

  disciplines: {
    eyebrow: b("USŁUGI — DYSCYPLINY", "SERVICES — DISCIPLINES"),
    title: b("DYSCYPLINY", "DISCIPLINES"),
    aside: b("Pięć Atelierów", "Five Ateliers"),
    items: [
      {
        name: b("Architektura formy", "Form Architecture"),
        desc: b(
          "Dialog między formą a tożsamością.",
          "A conversation between form and identity."
        ),
      },
      {
        name: b("Koloryzacja Atelier", "Colour Architecture"),
        desc: b(
          "Światło i głębia zamknięte w formie.",
          "Light and shadow, sculpted into the strand."
        ),
      },
      {
        name: b("Rytuał Odbudowy", "The Ritual"),
        desc: b(
          "Rytuał regeneracji i świadomej pielęgnacji.",
          "A ceremony of restoration and intention."
        ),
      },
      {
        name: b("Projekty Indywidualne", "The Commission"),
        desc: b(
          "Autorskie fryzury dla sesji i produkcji editorialowych.",
          "Bespoke hair direction for editorial and campaign."
        ),
      },
      {
        name: b("Konsultacja Atelier", "Atelier Appointment"),
        desc: b(
          "Prywatna konsultacja z dyrektorką atelier.",
          "A private session with the directrice herself."
        ),
      },
    ],
    atelierMenu: {
      link: b("Menu Atelier", "Atelier Menu"),
      viewLink: b("Zobacz Menu Atelier", "View Atelier Menu"),
      subtitle: b("Usługi | Rytuały", "Services | Rituals"),
      description: b(
        "Poznaj usługi, czas trwania i ceny.",
        "Explore all services, durations and pricing."
      ),
      descriptionAlt: b(
        "Szczegółowe menu usług i rytuałów atelier.",
        "Detailed service catalogue and atelier rituals."
      ),
      explore: b(
        "Poznaj Usługi | Cennik",
        "Explore Services | Pricing"
      ),
    },
  },

  gallery: {
    brand: b("AURELIA", "AURELIA"),
    atelier: b("PRYWATNE ATELIER FRYZJERSKIE", "PRIVATE HAIR ATELIER"),
    selectedWorks: b("WYBRANE REALIZACJE", "SELECTED WORKS"),
    volume: b("MMXXVI", "MMXXVI"),
    quoteLine1: b("Włosy nie są dodatkiem.", "Hair is not an accessory."),
    quoteLine2: b("Są architekturą.", "It is architecture."),
    viewAll: b("Zobacz wszystkie realizacje", "View all works"),
    themes: b("FORMA / RUCH / STRUKTURA", "FORM / MOVEMENT / STRUCTURE"),
    captions: [
      b("Tekstura I", "Texture I"),
      b("Ruch", "Movement"),
      b("Linia", "Line"),
      b("Studium", "Study"),
      b("Forma", "Form"),
      b("Narzędzie", "Tool"),
      b("Cień", "Shadow"),
      b("Sylwetka", "Silhouette"),
      b("Architektura", "Architecture"),
      b("Manifest", "Manifest"),
    ],
    hoverLabels: [
      b("RYTUAŁ Nº03", "RITUAL Nº03"),
      b("PARYŻ / MAYFAIR", "PARIS / MAYFAIR"),
      b("FORMA / STRUKTURA", "FORM / STRUCTURE"),
      b("TEKSTURA I", "TEXTURE I"),
      b("STUDIUM", "STUDY"),
    ],
    alts: [
      b("Tekstura włosów", "Hair texture"),
      b("Ruch i forma", "Movement and form"),
      b("Linia cięcia", "Cut line"),
      b("Studium światła", "Light study"),
      b("Forma fryzury", "Hair form"),
      b("Narzędzie atelier", "Atelier tool"),
      b("Cień architektoniczny", "Architectural shadow"),
      b("Sylwetka", "Silhouette"),
      b("Portret editorialny", "Editorial portrait"),
      b("Kompozycja still", "Still composition"),
    ],
  },

  testimonials: {
    label: b("GŁOSY — KLIENTELA", "VOICES — CLIENTELE"),
    items: [
      {
        lines: [
          b(
            "Weszłam z historią.",
            "I walked in with a history."
          ),
          b(
            "Wyszłam z nową wersją siebie.",
            "I walked out with a future."
          ),
        ],
        attribution: b("— C.M., Paryż · 2024", "— C.M., Paris · 2024"),
        footnote: b("C.M., Paryż", "C.M., Paris"),
      },
      {
        lines: [
          b(
            "Jedyne atelier, któremu ufam przy pracy editorialowej.",
            "The only atelier I trust for my editorial work."
          ),
        ],
        attribution: b("— Isabelle M., Paryż", "— Isabelle M., Paris"),
        footnote: b("Isabelle M., Paryż", "Isabelle M., Paris"),
      },
      {
        lines: [
          b(
            "Sofia jest artystką. Efekty mówią same za siebie.",
            "Sofia is an artist. The results speak for themselves."
          ),
        ],
        attribution: b("— Margaux D., Londyn", "— Margaux D., London"),
        footnote: b("Margaux D., Londyn", "Margaux D., London"),
      },
      {
        lines: [
          b(
            "Nigdy wcześniej moje włosy nie były tak dopracowane.",
            "My hair has never felt so intentionally designed."
          ),
        ],
        attribution: b("— Chen L., Nowy Jork", "— Chen L., New York"),
        footnote: b("Chen L., Nowy Jork", "Chen L., New York"),
      },
    ],
  },

  products: {
    label: b("OBIEKTY RYTUAŁU", "Ritual Objects"),
    items: [
      {
        name: b("Olejek Lumière", "Huile de Lumière"),
        tagline: b(
          "Tłoczony argan. Świadoma formuła.",
          "Cold-pressed argan. Pressed intention."
        ),
      },
      {
        name: b("Czarna Esencja", "L'Essence Noire"),
        tagline: b(
          "Serum stworzone z precyzją.",
          "A serum that knows where to go."
        ),
      },
    ],
  },

  closingManifesto: {
    label: b("MANIFESTO", "MANIFESTO"),
    headline: b("Forma jest ciszą.", "Form is silence."),
    pillars: b("RYTUAŁ · FORMA · CISZA", "RITUAL · FORM · SILENCE"),
  },

  booking: {
    label: b(
      "ROZPOCZNIJ SWOJĄ TRANSFORMACJĘ",
      "BEGIN YOUR TRANSFORMATION"
    ),
    headline: [
      b("Zarezerwuj", "Reserve Your"),
      b("Sesję", "Atelier"),
      b("Atelier.", "Session."),
    ],
    availability: b(
      "Prywatne sesje · Ograniczona dostępność",
      "Private Sessions · Limited Availability"
    ),
    cta: b("Umów Konsultację", "Request a Consultation"),
  },

  footer: {
    tagline: b("Prywatne Atelier Fryzjerskie", "Maison de Coiffure"),
    appointmentOnly: b(
      "Wyłącznie po wcześniejszej rezerwacji",
      "By appointment only"
    ),
    locations: b(
      "Paryż · Mayfair · Nowy Jork",
      "Paris · Mayfair · New York"
    ),
    copyright: b(
      "© MMXXVI AURELIA. Wszelkie prawa zastrzeżone.",
      "© MMXXVI AURELIA. All rights reserved."
    ),
    credit: b(
      "Created by Aurelia Studio",
      "Made by AURELIA Studio"
    ),
    privacyPolicy: b("Polityka Prywatności", "Privacy Policy"),
    terms: b("Regulamin", "Terms"),
    backToTop: b("Wróć do góry", "Back to top"),
    cityParis: b("Paryż", "Paris"),
    cityMayfair: b("Mayfair", "Mayfair"),
    cityNewYork: b("Nowy Jork", "New York"),
  },
} as const;
