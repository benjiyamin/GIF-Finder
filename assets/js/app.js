function Application() {
  //this.terms = terms
  let self = this

  // Query the search term to the Giphy API
  this.renderImages = function (term) {
    let apiKey = 'yaCBLMf7PBdKsRLBuqoknHR7A15qjn5V'
    let queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + term + '&limit=10&offset=0&rating=G&lang=en'
    $.ajax({
      method: 'GET',
      url: queryUrl
    }).then(function (response) {
      //console.log(response.data)
      let $images = $('#images')
      $images.empty()
      let imagesData = response.data
      imagesData.forEach(imgData => {
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
        let overlay = $('<div>')
          .addClass('card-img-overlay')
          .append(cardTitle, cardText)
        let card = $('<div>')
          .addClass('card bg-dark text-white text-shadow')
          .append(img, overlay)
        $images.prepend(card)
      });
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
        self.renderImages(term)
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
    event.preventDefault();
    let $termInput = $('#termInput')
    let input = $termInput.val().trim()
    if (input) {
      self.renderTerm(input)
    }
    $termInput.val('')
  })

  // Image overlay event listeners
  $(document.body).on({

    // Animated GIF when hovering
    mouseenter: function () {
      console.log('here')
      let cardImg = $(this).prev()
      let state = cardImg.attr('data-state')
      if (state === 'still') {
        let animateUrl = cardImg.attr('data-animate')
        cardImg
          .attr('data-state', 'animate')
          .attr('src', animateUrl)
      }
    },

    // Still GIF when not hovering
    mouseleave: function () {
      let cardImg = $(this).prev()
      let state = cardImg.attr('data-state')
      if (state === 'animate') {
        let stillUrl = cardImg.attr('data-still')
        cardImg
          .attr('data-state', 'still')
          .attr('src', stillUrl)
      }
    }
  }, '.card-img-overlay')
}