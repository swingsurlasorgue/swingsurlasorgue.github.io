/**
 * Génération automatique des données structurées Schema.org
 * pour les événements présents dans /data/events.json
 *
 * Seuls les événements à venir sont ajoutés au JSON-LD.
 */

document.addEventListener("DOMContentLoaded", async function () {

  const EVENTS_URL = "/data/events.json";
  const PAGE_URL = "https://www.swingsurlasorgue.fr/pages/events.html";

  try {
    const response = await fetch(EVENTS_URL);

    if (!response.ok) {
      throw new Error("Impossible de charger events.json");
    }

    const data = await response.json();

    if (!data.concerts || !Array.isArray(data.concerts)) {
      throw new Error("Format de events.json inattendu");
    }

    // Date actuelle, sans tenir compte de l'heure
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /*
     * Pages des groupes présents sur le site.
     */
    const groupPages = {
      "Accord Sensible": "/pages/bands/accordsensible.html",
      "Accord Sensible (duo)": "/pages/bands/accordsensible.html",
      "Accord Sensible (quartet)": "/pages/bands/accordsensible.html",
      "Black & White": "/pages/bands/blackandwhite.html"
    };

    /*
     * Extrait la commune depuis :
     * "84 - Gargas" -> "Gargas"
     * "13 - Orgon"  -> "Orgon"
     */
    function getCity(ville) {
      if (!ville) return "";

      const parts = ville.split(" - ");

      return parts.length > 1
        ? parts.slice(1).join(" - ").trim()
        : ville.trim();
    }

    /*
     * Création d'un identifiant stable pour chaque événement.
     */
    function createEventId(event, index) {
      const slug = [
        event.date,
        event.groupe,
        event.evenement,
        index
      ]
        .join("-")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      return `${PAGE_URL}#${slug}`;
    }

    /*
     * Création du Schema.org d'un événement.
     */
    function createEventSchema(event, index) {

      const city = getCity(event.ville);

      const eventSchema = {
        "@type": "Event",
        "@id": createEventId(event, index),

        "name": `${event.evenement} - ${event.groupe}`,

        "description":
          `${event.evenement} avec ${event.groupe}` +
          (city ? ` à ${city}` : "") +
          ". Événement proposé dans le cadre des activités musicales de Swing sur la Sorgue.",

        "startDate": event.date,

        "eventStatus": "https://schema.org/EventScheduled",

        "eventAttendanceMode":
          "https://schema.org/OfflineEventAttendanceMode",

        "location": {
          "@type": "Place",
          "name": event.lieu
        },

        "organizer": {
          "@type": "Organization",
          "name": "Swing sur la Sorgue",
          "url": "https://www.swingsurlasorgue.fr/"
        }
      };

      /*
       * On ajoute uniquement la commune réellement
       * présente dans events.json.
       */
      if (city) {
        eventSchema.location.address = {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressCountry": "FR"
        };
      }

      /*
       * Groupe musical qui se produit.
       */
      if (event.groupe) {

        eventSchema.performer = {
          "@type": "MusicGroup",
          "name": event.groupe
        };

        const groupPage = groupPages[event.groupe];

        if (groupPage) {
          eventSchema.performer.url =
            "https://www.swingsurlasorgue.fr" + groupPage;
        }
      }

      return eventSchema;
    }

    /*
     * Ne conserver que les événements futurs ou du jour.
     */
    const upcomingEvents = data.concerts.filter(function (event) {

      if (!event.date) {
        return false;
      }

      const eventDate = new Date(event.date + "T00:00:00");

      return eventDate >= today;
    });

    /*
     * Création du graphe Schema.org.
     */
    const schema = {
      "@context": "https://schema.org",
      "@graph": upcomingEvents.map(function (event, index) {
        return createEventSchema(event, index);
      })
    };

    /*
     * Aucun événement à venir :
     * ne pas injecter de JSON-LD vide.
     */
    if (schema["@graph"].length === 0) {
      return;
    }

    /*
     * Injection dans le <head>.
     */
    const script = document.createElement("script");

    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);

    document.head.appendChild(script);

    console.log(
      `${schema["@graph"].length} événement(s) ajouté(s) au Schema.org.`
    );

  } catch (error) {

    console.error(
      "Erreur lors de la génération du Schema.org des événements :",
      error
    );

  }

});