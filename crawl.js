const axios = require("axios");
const cheerio = require("cheerio");
const jsonfile = require("jsonfile");

const getPhoto = async (url) => {
  try {
    const resp = await axios.get(url);
    const $ = cheerio.load(resp.data);
    const lightboxgallery = $(".app-content-section").find("lightbox-gallery");
    const medialink = lightboxgallery
      .find(".lightbox-gallery-image")
      .attr("href");
    const rowcaption = lightboxgallery.find("figcaption.app-photo-row-caption");
    const truncates = rowcaption.find(".truncate");
    const captionobserver = $(truncates[1])
      .find("a.caption-observer")
      .text()
      .trim();

    return [`https://waarneming.nl/${medialink}`, captionobserver];
  } catch (error) {
    console.log("error");
    throw error;
  }
};

axios
  .get(
    "https://waarneming.nl/locations/189903/species/?species_group_id=0&start_date=2024-09-19&end_date=2024-09-20&filter_month=&filter_year=&include_exotic_and_extinct=on&own_species=all+species"
  )
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const tbody = $(".app-content-body > .row .species-seen-table").find(
      "tbody"
    );
    const rows = tbody.find("tr");
    const species = [];

    rows.each(function () {
      const tds = $(this).find("td");
      const namenode = $(tds[1]).find("a").text().trim();
      const photo_link = $(tds[7]).find("a");
      let extrainfos = ["", ""];
      if (photo_link.length > 0) {
        const url = photo_link.attr("href");
        extrainfos = getPhoto(`https://waarneming.nl/${url}`);
      }
      species.push({
        name: namenode,
        photo: extrainfos[0],
        observer: extrainfos[1],
      });
    });

    const file = "data/species.json";
    const obj = species;

    jsonfile
      .writeFile(file, obj)
      .then((res) => {
        console.log("Write complete");
      })
      .catch((error) => console.error(error));
  });
