const $ = document.querySelector.bind(document)

const mapEl = $('#map')
const locations = JSON.parse(mapEl.dataset.locations)

console.log(locations)

mapboxgl.accessToken =
'sk.eyJ1IjoiY29uZ2RhdCIsImEiOiJja3pyN2gwdHcwN2hpMnV0OW9janRodXVsIn0.W5aJDzs7zqQ8NOId62lMmA'

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: [-74.5, 40], // starting position [lng, lat]
	zoom: 9, // starting zoom
})
