function Application() {
  let self = this
  this.images = []
  this.favorites = []
  let apiKey = 'yaCBLMf7PBdKsRLBuqoknHR7A15qjn5V'

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
  this.storeFavorites = function () {
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

  // Produce an image card from the data
  this.imageCard = function (imgData) {
    let img = $('<img>')
      .addClass('card-img-top')
      .attr('src', imgData.images.fixed_height_still.url)
      .attr('data-still', imgData.images.fixed_height_still.url)
      .attr('data-animate', imgData.images.fixed_height.url)
      .attr('data-state', 'still')
    let cardTitle = $('<h5>')
      .addClass('card-title')
      .text(imgData.title)
      .hide()
    let cardText = $('<p>')
      .addClass('card-text rating-text')
      .text('Rating: ' + imgData.rating.toUpperCase())
      .hide()
    let favorite = $('<button>')
      .attr('type', 'button')
      .addClass('btn btn-link fav-btn text-shadow')
      .html('<i class="fas fa-heart"></i>')
      .hide()
      .on('click', function () {
        if (self.favorites.indexOf(imgData) == -1) {
          //if (self.favorites.findIndex(favImg => favImg == imgData) === -1) {
          self.favorites.push(imgData) // Favorite image
          $(this).addClass('favorited')
        } else {
          self.favorites.splice(self.favorites.indexOf(imgData), 1) // Unfavorite image
          $(this).removeClass('favorited')
        }
        self.storeFavorites()
      })
    //if (!self.favorites.indexOf(imgData) == -1) {
    if (!(self.favorites.findIndex(favImg => favImg == imgData) === -1)) { // Img is favorited
      favorite.addClass('favorited')
    }
    let overlay = $('<div>')
      .addClass('card-img-overlay')
      .append(cardTitle, cardText, favorite)
      .hover(function () {
        let cardImg = $(this).prev()
        self.animateGif(cardImg)
        $(this).children().slideDown()
      }, function () {
        let cardImg = $(this).prev()
        self.freezeGif(cardImg)
        $(this).children().slideUp()
      })
    let card = $('<div>')
      .addClass('card bg-dark text-white text-shadow')
      .append(img, overlay)
    return card
  }

  // Render an array images
  this.renderImages = function (images) {
    let $images = $('#images')
    $images.empty()
    imagesToRender = this.images
    if (images) {
      imagesToRender = images
    }
    imagesToRender.forEach(imgData => {
      let card = this.imageCard(imgData)
      $images.prepend(card)
    })
  }

  // Query the search term to the Giphy API
  this.loadFromGiphy = function (term, render = false) {
    term = term.replace(/[^a-zA-Z0-9]/g, '') // Remove non-number and non-letter characters
    let queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + term + '&limit=10&offset=0&rating=PG-13&lang=en'
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

  this.trendingFromGiphy = function () {
    let queryUrl = 'https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=10&rating=PG-13&lang=en'
    $.ajax({
      method: 'GET',
      url: queryUrl
    }).then(function (response) {
      self.images = response.data
      self.renderImages()
    })
  }

  // Add a new term from input when the term button is pressed
  $('#termButton').on('click', function (event) {
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

  $('#trendingButton').on('click', function () {
    self.trendingFromGiphy()
  })

}