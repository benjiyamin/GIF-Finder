function Application() {
  //this.terms = terms
  let self = this
  this.images = []
  this.favorites = []

  // Animated GIF when hovering
  this.animateGif = function (cardImg) {
    let state = cardImg.attr('data-state')
    if (state === 'still') {
      let animateUrl = cardImg.attr('data-animate')
      cardImg
        .attr('data-state', 'animate')
        .attr('src', animateUrl)
    }
  }

  // Still GIF when not hovering
  this.freezeGif = function (cardImg) {
    let state = cardImg.attr('data-state')
    if (state === 'animate') {
      let stillUrl = cardImg.attr('data-still')
      cardImg
        .attr('data-state', 'still')
        .attr('src', stillUrl)
    }
  }

  // Locally store favorite pics
  this.storeFavorites = function() {
    localStorage.clear()
    localStorage.setItem('favorites', JSON.stringify(this.favorites))
  }

  // Load Locally stored favorite pics
  this.loadFavorites = function () {
    let favString = localStorage.getItem('favorites')
    if (favString) {
      this.favorites = JSON.parse(localStorage.getItem('favorites'))
    } else {
      this.favorites = []
    }
  }

  // Render the loaded images
  this.renderImages = function (images) {
    let $images = $('#images')
    $images.empty()
    imagesToRender = this.images
    if (images) {
      imagesToRender = images
    }
    imagesToRender.forEach(imgData => {
      let img = $('<img>')
        .addClass('card-img-top')
        .attr('src', imgData.images.fixed_height_still.url)
        .attr('data-still', imgData.images.fixed_height_still.url)
        .attr('data-animate', imgData.images.fixed_height.url)
        .attr('data-state', 'still')
      let cardTitle = $('<h5>')
        .addClass('card-title')
        .text(imgData.title)
      let cardText = $('<p>')
        .addClass('card-text rating-text')
        .text('Rating: ' + imgData.rating.toUpperCase())
      let favorite = $('<a>')
        .attr('href', '#')
        .html('<i class="fas fa-heart"></i>')
        .addClass('fav-btn')
        .on('click', function () {
          if (self.favorites.indexOf(imgData) == -1) {
            self.favorites.push(imgData) // Favorite image
            self.storeFavorites()
            $(this).addClass('favorited')
          } else {
            self.favorites.splice(self.favorites.indexOf(imgData), 1) // Unfavorite image
            $(this).removeClass('favorited')
          }
        })
      //if (!self.favorites.indexOf(imgData) == -1) {
      if (!(self.favorites.findIndex(favImg => favImg == imgData) === -1)) {  // Img is favorited
        favorite.addClass('favorited')
      }
      let overlay = $('<div>')
        .addClass('card-img-overlay')
        .append(cardTitle, cardText, favorite)
        .hover(function () {
          let cardImg = $(this).prev()
          self.animateGif(cardImg)
        }, function () {
          let cardImg = $(this).prev()
          self.freezeGif(cardImg)
        })
      let card = $('<div>')
        .addClass('card bg-dark text-white text-shadow')
        .append(img, overlay)
      $images.prepend(card)
    })
  }

  // Query the search term to the Giphy API
  this.loadFromGiphy = function (term, render = false) {
    let apiKey = 'yaCBLMf7PBdKsRLBuqoknHR7A15qjn5V'
    let queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + term + '&limit=10&offset=0&rating=G&lang=en'
    $.ajax({
      method: 'GET',
      url: queryUrl
    }).then(function (response) {
      self.images = response.data
      if (render) {
        self.renderImages()
      }
    })
  }

  // Add term buttons that can request to Giphy API or be deleted
  this.renderTerm = function (term) {
    let deleteBtn = $('<span>')
      .addClass('badge badge-light')
      .text('X')
      .on('click', function () {
        $(this).parent().remove()
      })
    let button = $('<a>')
      .attr('href', '#')
      .attr('role', 'button')
      .addClass('badge badge-info term-badge')
      .text(term + ' ')
      .append(deleteBtn)
      .on('click', function () {
        self.loadFromGiphy(term, render = true)
      })
    $('#terms').append(button)
    return button
  }

  // Bulk add term buttons
  this.renderterms = function (terms = []) {
    $('#terms').empty()
    terms.forEach(term => {
      this.renderTerm(term)
    });
  }

  // Add a new term from input when the term button is pressed
  $('#termButton').on('click', function (event) {
    //event.preventDefault();
    let $termInput = $('#termInput')
    let input = $termInput.val().trim()
    if (input) {
      self.renderTerm(input)
    }
    $termInput.val('')
  })

  $('#favoritesButton').on('click', function () {
    self.renderImages(self.favorites)
  })

}