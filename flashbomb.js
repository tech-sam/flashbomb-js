const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = 'YOUR_API_KEY';
const categoryList = ['cars', 'houses', 'animals']; // replace this with your list of categories
const numImages = 5; // replace this with the number of images you want to download for each category

for (const category of categoryList) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(category)}&per_page=${numImages}`;

  axios.get(apiUrl)
    .then((response) => {
      const categoryDir = path.join(__dirname, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir);
      }

      for (const image of response.data.hits) {
        const imageUrl = image.largeImageURL;
        const fileName = `${image.id}.jpg`;
        const filePath = path.join(categoryDir, fileName);

        axios.get(imageUrl, { responseType: 'arraybuffer' })
          .then((response) => {
            fs.writeFileSync(filePath, response.data, { encoding: 'binary' });
            console.log(`Downloaded image: ${filePath}`);
          })
          .catch((error) => {
            console.error(`Failed to download image: ${filePath}`, error);
          });
      }
    })
    .catch((error) => {
      console.error(`Failed to search for images for category '${category}'`, error);
    });
}
