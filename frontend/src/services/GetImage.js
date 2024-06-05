import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

// Function to download the image to a local file
async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
    });
}

// Function to get the URL of the first image from a Bing search query
async function getFirstImageURL(query) {
    const searchURL = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchURL);
    const $ = cheerio.load(data);
    const firstImageElement = $('.mimg').first();
    const firstImageURL = firstImageElement.attr('src');

    // Check if the image element exists and has a src attribute
    if (!firstImageElement.length || !firstImageURL) {
        throw new Error('No image found or missing src attribute.');
    }

    // If the src attribute is a relative URL, prepend the base URL
    if (firstImageURL.startsWith('/')) {
        return `https://www.bing.com${firstImageURL}`;
    }
    return firstImageURL;
}

// Self-invoking async function to perform the image download
(async () => {
    const inputQuery = 'YOUR_SEARCH_QUERY'; // Replace with your search query
    const downloadFolder = path.resolve(__dirname, 'downloads');

    // Ensure the download folder exists
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
    }

    try {
        const imageURL = await getFirstImageURL(inputQuery);
        const imageDownloadPath = path.resolve(downloadFolder, 'first_image.jpg');
        await downloadImage(imageURL, imageDownloadPath);
        console.log('Image downloaded successfully:', imageDownloadPath);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();

export default getFirstImageURL;
