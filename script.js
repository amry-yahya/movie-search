let search_button = document.querySelector('.search-button');
let enter_click = document.querySelector('.title-input');

search_button.addEventListener('click', findMovies);
enter_click.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') findMovies();
});
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('show-detail')) findMovieDetail(e.target);
})

async function findMovies() {
    let input_element = document.querySelector('.title-input');
    let keyword = input_element.value;
    let search_result = await fecthRequestMovies(keyword);
    updateUI_searchResult(search_result);
}

async function findMovieDetail(element) {
    let movie_detail = await fecthRequestDetail(element.dataset.id);
    updateUI_movieDetail(movie_detail);
}

function fecthRequestMovies(keyword) {
    return fetch('http://www.omdbapi.com/?apikey=dca61bcc&s=' + keyword)
        .then(response => response.json())
        .then(response => response.Search);
}

function fecthRequestDetail(movie_id) {
    return fetch('http://www.omdbapi.com/?apikey=dca61bcc&i=' + movie_id)
        .then(response => response.json())
        .then(response => response);
}

function updateUI_searchResult(search_result) {
    let cards = "";
    for (const element of search_result) cards += getMovies(element);
    let result_place = document.querySelector('.movies');
    result_place.innerHTML = cards;
}

function updateUI_movieDetail(movie_detail) {
    let detail_info = getMovieDetail(movie_detail);
    let detail_template = document.querySelector('.modal-content');
    detail_template.innerHTML = detail_info;
}

function getMovies(m) {
    return `<div class="col-md-2 my-3">
                <div class="card bg-warning text-dark">
                    <img src="${m.Poster}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title" style="font-size: 0.8rem;">${m.Title}</h5>
                            <h6 class="card-subtitle mb-2 text-danger" style="font-size: 0.8rem;">${m.Year}</h6>
                            <a href="#" class="btn btn-primary show-detail" data-id="${m.imdbID}" data-bs-toggle="modal" data-bs-target="#moviesModal" style="font-size: 0.8rem;">Show Details</a>
                        </div>
                </div>
            </div>`;
}

function getMovieDetail(m) {
    return `<div class="modal-header">
                <h5 class="modal-title text-black" id="moviesModalLabel"><strong>${m.Title}</strong></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-5">
                        <img src="${m.Poster}" alt="poster not found" class="img-fluid">
                    </div>
                    <div class="col-7">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Year :</strong> ${m.Year}</li>
                            <li class="list-group-item"><strong>Genre :</strong> ${m.Genre}</li>
                            <li class="list-group-item"><strong>Director :</strong> ${m.Director}</li>
                            <li class="list-group-item"><strong>Actors :</strong> ${m.Actors}</li>
                            <li class="list-group-item"><strong>Language :</strong> ${m.Language}</li>
                            <li class="list-group-item"><strong>Country :</strong> ${m.Country}</li>
                            <li class="list-group-item"><strong>Rating :</strong> ${m.imdbRating}</li>
                            <li class="list-group-item"><strong>Plot :</strong> <br>
                                "${m.Plot}"
                            </li>
                        </ul>
                    </div>
                </div>
            </div>`;
}