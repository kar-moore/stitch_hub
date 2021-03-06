$(document).ready(function () {
  getCurrentUser(function(currentUser) {
    getCsrfToken(function (csrfToken) {
      loadNavBarTemplate(currentUser);
      var userProfileId = window.sessionStorage.getItem('userProfileId');

      if (currentUser == null || (userProfileId != currentUser._id)){
        $('#button-holder').hide();
        $('#following-template-container').hide()
      }



    $.ajax({
      url: '/users/' + userProfileId,
      method: 'GET',
      success: function (data) {
        // load the user header template
        loadUserProfileHeaderTemplate(data.user, currentUser, csrfToken);
      },
      error: function (err) {
        console.log(err);
      }
    });

      



      // load chart feed template
      $.ajax({
        url: '/charts/author/' + userProfileId,
        method: 'GET',
        success: function(charts) {
          // loads the chart feed into #charts-container div and sets all controllers
          // for the chart feed
          loadChartFeedTemplate(charts, currentUser, csrfToken);
        },
        error: function(error) {
          console.log('Error fetching charts');
          console.log(error);
        }
      });

      $('#following-charts-button').on('click', function () {
        $.ajax({
          url: '/users/user/' + currentUser._id + '/following/charts',
          method: 'GET',
          success: function(charts) {
            loadChartFeedTemplate(charts, currentUser, csrfToken);
            document.getElementById('listTitle').innerHTML = "Charts of Followed Users";
          },
          error: function(err) {
            console.log('Error fetching charts of those you follow');
            console.log(err);
          }
        });
      })

        $('#liked-charts-button').on('click', function () {
        charts = getLikedCharts(currentUser);
        loadChartFeedTemplate(charts, currentUser, csrfToken);
        document.getElementById('listTitle').innerHTML = "My Liked Charts";
        
      })

      $('#made-charts-button').on('click', function () {
        $.ajax({
          url: '/charts/author/' + userProfileId,
          method: 'GET',
          success: function(charts) {
            // loads the chart feed into #charts-container div and sets all controllers
            // for the chart feed
            loadChartFeedTemplate(charts, currentUser, csrfToken);
            document.getElementById('listTitle').innerHTML = "My Charts";
          },
          error: function(error) {
            console.log('Error fetching charts');
            console.log(error);
          }
        });
      });
    });
  });





});