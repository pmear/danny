const axios = require("axios");
const cheerio = require("cheerio");
const jsonfile = require("jsonfile");

const getPhoto = async (url, name) => {
  try {
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html);
    const lightboxgallery = $(".app-photo-gallery").find(".lightbox-gallery");
    const medialink = lightboxgallery
      .find(".lightbox-gallery-image")
      .attr("href");
    const rowcaption = lightboxgallery.find(".app-photo-row-caption");
    const truncates = rowcaption.find(".truncate");
    const captionobserver = $(truncates[1])
      .find(".caption-observer")
      .text()
      .trim();

    const captiondate = $(truncates[1]).find(".caption-date").text().trim();

    return {
      name: name,
      photo: `https://waarneming.nl${medialink}`,
      observer: captionobserver,
      date: captiondate,
    };
  } catch (error) {
    console.log(error);
  }
};

const crawl = () => {
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
      const rowarray = [];

      rows.each(function () {
        const tds = $(this).find("td");
        const name = $(tds[1]).find("a").text().trim();
        const photo_link = $(tds[7]).find("a");
        rowarray.push({
          name: name,
          photo_link:
            photo_link.length > 0
              ? `https://waarneming.nl/${photo_link.attr("href")}`
              : "",
        });
      });

      const promises = rowarray.map((row) => {
        if (row.photo_link !== "") {
          return getPhoto(row.photo_link, row.name);
        } else {
          return {
            name: row.name,
            photo: "",
            observer: "",
            date: "",
          };
        }
      });

      Promise.all(promises).then((values) => {
        const file = "data/species.json";
        const obj = values;
        jsonfile
          .writeFile(file, obj)
          .then((res) => {
            console.log("Write complete");
          })
          .catch((error) => console.error(error));
      });
    });
};

crawl();
