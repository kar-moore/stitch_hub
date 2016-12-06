var loadChartTemplate = function(jsonChart) {


var number = getNumberOfLikes(jsonChart._id);

  $.get('mustache-templates/chart.template.html', function (template) {
    var html = Mustache.render($(template).html(), { title: jsonChart.title, description: jsonChart.description, author:jsonChart.author, number: number, });
    $('#chart-container').append(html);

    // color the canvas based on the given chart
    var canvas = document.getElementById("canvas");
    var model = getChartFromJson(jsonChart);
    var standardSize = getStandardSize(jsonChart.type);
    var view = ChartView(standardSize.cellWidth, standardSize.cellHeight, model, canvas);
    view.draw();

    // add a link to the user when clicked in the username
    $('#user-profile-link').on('click', function() {
      window.sessionStorage.setItem('userProfileId', jsonChart.author);
      window.location = "user_profile.html";
    });

    $('#remix-button').on('click', function() {
      window.sessionStorage.setItem('chart', JSON.stringify(jsonChart));
      window.location = "chart_editing.html";
    });

    getCurrentUserLike(jsonChart._id, function(err, like) {
      // set the initial state of the button
      var liked = like ? true : false;
      $('#like-button').text(liked ? 'Unlike' : 'Like');
      // set the onclick listener of the button
      $('#like-button').on('click', function() {
        if (liked) {
          $('#like-button').text('Like');
          unlikeChart(jsonChart._id, jsonChart.author);
          liked = false;
        } else {
          $('#like-button').text('Unike');
          likeChart(jsonChart._id);
          liked = true;
        }
      });
    });

    $('#like-button').on('click', function() {


      likeChart(jsonChart._id);


    });
  });
}