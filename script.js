let search_button = document.querySelector('.search-button');
let enter_click = document.querySelector('.title-input');
let detailMovieContainer = document.querySelector('.modal-content');
let result_container = document.querySelector('.movies');

search_button.addEventListener('click', findMovies);
enter_click.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') findMovies();
});
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('show-detail')) findMovieDetail(e.target);
})

async function findMovies() {
    addLoading(result_container)
    try {
        let input_element = document.querySelector('.title-input');
        let keyword = input_element.value;
        keywordValidation(keyword);
        let search_result = await fecthRequestMovies(keyword);
        updateUI_searchResult(search_result);
    } catch (error) {
        updateUI_error(error);
    }

}

async function findMovieDetail(element) {
    addLoading(detailMovieContainer);
    let movie_detail = await fecthRequestDetail(element.dataset.id);
    updateUI_movieDetail(movie_detail);
}

function fecthRequestMovies(keyword) {
    return fetch('http://www.omdbapi.com/?apikey=dca61bcc&s=' + keyword)
        .then(response => response.json())
        .then(response => {
            if (response.Response === 'False') {
                throw new Error(response.Error);
            }
            return response.Search;
        });
}

function fecthRequestDetail(movie_id) {
    return fetch('http://www.omdbapi.com/?apikey=dca61bcc&i=' + movie_id)
        .then(response => response.json())
        .then(response => response);
}

function updateUI_searchResult(search_result) {
    let cards = "";
    for (const element of search_result) cards += getMovies(element);
    result_container.innerHTML = cards;
}

function updateUI_movieDetail(movie_detail) {
    let detail_info = getMovieDetail(movie_detail);
    detailMovieContainer.innerHTML = detail_info;
}

function getMovies(m) {
    return `<div class="col-md-2 my-3">
                <div class="card bg-dark border-secondary" style="height: 25rem;">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" style="font-size: 0.8rem;"><strong>${m.Title}</strong></h5>
                        <h6 class="card-subtitle mb-2 text-muted" style="font-size: 0.8rem;">${m.Year}</h6>
                        <a href="#" class="btn btn-secondary show-detail mt-auto" data-id="${m.imdbID}" data-bs-toggle="modal" data-bs-target="#moviesModal" style="font-size: 0.8rem;">Show Details</a>
                    </div>
                </div>
            </div>`;
}

function getMovieDetail(m) {
    return `<div class="modal-header bg-dark border-dark">
                <h5 class="modal-title" id="moviesModalLabel"><strong>${m.Title}</strong></h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-5">
                        <img src="${m.Poster}" alt="poster not found" class="img-fluid text-light">
                    </div>
                    <div class="col-7">
                        <ul class="list-group">
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Year :</strong> ${m.Year}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Genre :</strong> ${m.Genre}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Director :</strong> ${m.Director}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Actors :</strong> ${m.Actors}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Language :</strong> ${m.Language}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Country :</strong> ${m.Country}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Rating :</strong> ${m.imdbRating}</li>
                            <li class="list-group-item bg-dark text-light border-secondary"><strong>Plot :</strong> <br>
                                "${m.Plot}"
                            </li>
                        </ul>
                    </div>
                </div>
            </div>`;
}

function updateUI_error(error) {
    let error_element = `<h3>${error}</h3>`
    result_container.innerHTML = error_element;
}

function keywordValidation(keyword) {
    if (!keyword) {
        throw new Error('Please, input movie title!');
        return;
    }
}

function addLoading(element) {
    element.innerHTML = `<div class="d-flex justify-content-center my-3">
                            <div class="spinner-border text-light" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>`
}

