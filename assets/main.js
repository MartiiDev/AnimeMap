var markers = []
var currentFocus;
var searchInput = document.getElementById('search')


var map = L.map('map').setView([38, 137.5], 6);
map.attributionControl.setPrefix(false);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_no_buildings/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://martii.dev" target="_blank">Martii</a>, &copy; <a href="https://myanimelist.net" target="_blank">MyAnimeList</a>, &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy; <a href="https://carto.com/about-carto/" target="_blank">Carto</a>'
}).addTo(map);


for (var country of animeList) {
    for (var city of country.cities) {
        markers[city.city] = L.marker(city.coords).addTo(map);
        markers[city.city].bindPopup("<b>" + city.city + ", </b>" + country.country);
        markers[city.city].on('click', (function(city) {
	    	return function() {
		    	showAnimeList(city);
	    	}
	    })(city));
    }
}


searchInput.addEventListener("input", function(e) {
    closeAllLists();
    var val = this.value;
    if (!val) { return false; }
    currentFocus = -1;

    var searchListDiv = document.createElement("DIV");
    searchListDiv.setAttribute("id", this.id + "autocomplete-list");
    searchListDiv.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(searchListDiv);

    for (var country of animeList) {
    	for (var city of country.cities) {
	        if (city.city.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			    var listItemDiv = document.createElement("li");
			    searchInput.classList.remove("rounded-lg")
			    searchInput.classList.add("rounded-t-lg")
			    listItemDiv.classList.add("flex", "bg-white","last:rounded-b-lg", "px-1.5", "py-0.5", "cursor-pointer", "border-t", "first:border-0", "hover:bg-gray-300/50")
			    
			    var listItemIconDiv = document.createElement("DIV")
			    listItemIconDiv.innerHTML = "<i class='fa-solid fa-location-dot text-red-500 fa-fw mr-1'></i>";
			    listItemDiv.appendChild(listItemIconDiv);

			    var listItemLabelDiv = document.createElement("DIV")
			    listItemLabelDiv.classList.add("grow");
			    listItemLabelDiv.innerHTML = "<strong class='font-bold text-start'>" + city.city.substr(0, val.length) + "</strong>";
			    listItemLabelDiv.innerHTML += city.city.substr(val.length);
			    listItemDiv.appendChild(listItemLabelDiv);

			    listItemDiv.innerHTML += "<input type='hidden' value='" + city.city + "'>";
			    listItemDiv.addEventListener("click", (function(city) {
			    	return function() {
				        closeAllLists();
				    	showAnimeList(city);
			    	}
			    })(city));
			    searchListDiv.appendChild(listItemDiv);
	        }

        	for (var anime of city.animes) {
				if (anime.anime.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				    var listItemDiv = document.createElement("li");
				    searchInput.classList.remove("rounded-lg")
				    searchInput.classList.add("rounded-t-lg")
				    listItemDiv.classList.add("flex", "bg-white","last:rounded-b-lg", "px-1.5", "py-0.5", "cursor-pointer", "border-t", "first:border-0", "hover:bg-gray-300/50")
				    
				    var listItemIconDiv = document.createElement("DIV")
				    listItemIconDiv.innerHTML = "<i class='fa-solid fa-masks-theater text-blue-500 fa-fw mr-1'></i>";
				    listItemDiv.appendChild(listItemIconDiv);

				    var listItemLabelDiv = document.createElement("DIV")
				    listItemLabelDiv.classList.add("grow");
				    listItemLabelDiv.innerHTML = "<strong class='font-bold text-start'>" + anime.anime.substr(0, val.length) + "</strong>";
				    listItemLabelDiv.innerHTML += anime.anime.substr(val.length);
				    listItemDiv.appendChild(listItemLabelDiv);

				    listItemDiv.innerHTML += "<input type='hidden' value='" + anime.anime + "'>";
				    listItemDiv.addEventListener("click", (function(city) {
				    	return function() {
					        closeAllLists();
					    	showAnimeList(city);
				    	}
				    })(city));
				    searchListDiv.appendChild(listItemDiv);
        		}
        	}
    	}
    }
});


searchInput.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
    } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
    } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
            if (x) x[currentFocus].click();
        }
    }
});


function cityZoom(city) {
	map.setView(markers[city].getLatLng(), 9);
}

function showAnimeList(city) {
    cityZoom(city.city)
    searchInput.value = city.city;

    var animeListDiv = document.getElementById("animeList")
    animeListDiv.innerHTML = "";

    for (anime of city.animes) {
        var animeDiv = document.createElement("li")
        // animeDiv.classList.add("w-full", "p-2", "rounded-lg", "bg-white", "hover:underline")
        var malLink = document.createElement("a")
        malLink.classList.add("hover:underline")
        malLink.href = "https://myanimelist.net/anime/" + anime.mal;
        malLink.target = "_blank";
        var animeName = document.createTextNode(anime.anime);
        malLink.appendChild(animeName);
        animeDiv.appendChild(malLink);
        animeListDiv.appendChild(animeDiv);
    }
}

function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("!bg-gray-300");
}

function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("!bg-gray-300");
    }
}

function closeAllLists(elmnt) {
    searchInput.classList.remove("rounded-t-lg")
    searchInput.classList.add("rounded-lg")
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != searchInput) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}
document.addEventListener("click", function(e) {
    closeAllLists(e.target);
});