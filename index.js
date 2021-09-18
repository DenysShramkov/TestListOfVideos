const ListOfVideos = require('./modules/list'); 
const path = require('path');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views'); 
app.use(express.static(path.join(__dirname, 'public')))

const newListOfVideos = new ListOfVideos();
newListOfVideos.data = 'https://youtube.googleapis.com/youtube/v3/playlistItems?fields=items(snippet(title),contentDetails(videoPublishedAt))&part=snippet,contentDetails&maxResults=200&playlistId=PL5CaGd7qPVW8Paw3aSfAwpnnoqvGNwbdN&key=AIzaSyCDVgQiEkmFhoiLFJDRAZlMrPs2jHvvi8A';

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/api/list', (req, res) => {
	newListOfVideos.data.then((data) => {
		res.end(JSON.stringify(data));
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
