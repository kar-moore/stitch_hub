var getNumberOfLikes = function (chartID) {

  var result;
  $.ajax({
    url: '/like/chart/' + chartID + '/count',
    method: 'GET',
    async: false,
    data: {
      chartId: chartID
    },
    success: function (number) {
      result = number.message;
    },
    error: function (error) {
      console.log('Error counting likes');
      console.log(error);
    }

  });//end ajax
  return result;
};


//returns true if a user has liked a chart, false if not
var getCurrentUserLike = function (chartId, currentUser, callback) {
  if (currentUser) {
    $.ajax({
      url: '/like/chart/' + chartId + '/user/' + currentUser._id,
      method: 'GET',
      success: function (data) {
        var result = false;
        if (data.message !== null){
          result = true;
        }
        
        callback(null, result);
      },
      error: function (err) {
        callback(err, null);
      }
    });
  } else {
    callback(null, null);
  }
};

var likeChart = function (chartId, csrfToken) {
  $.ajax({
    url: '/like',
    method: 'POST',
    data: {
      chartID: chartId,
      _csrf: csrfToken,
    },
    success: function () {
      window.location.reload();
    },
    error: function (error) {
      console.log('Error liking it');
      console.log(error);
    }
  });//end ajax
};

var unlikeChart = function (chartId, csrfToken) {
  $.ajax({
    url: '/like',
    data: {
      chartId: chartId,
      _csrf: csrfToken,
    },
    method: 'DELETE',
    success: function () {
      window.location.reload();
    },
    error: function (error) {
      console.log('Error unliking it');
      console.log(error);
    }
  });//end ajax
};

var getLikedCharts = function (currentUser) {
  var userId = currentUser._id;
  var result;
  $.ajax({
    url: '/like/user/' + userId + '/likedCharts/',
    method: 'GET',
    async: false,
    data: {}
    ,
    success: function (likedCharts) {
      result = likedCharts.message;
    }
    ,
    error: function (error) {
      console.log('Error getting liked charts');
      console.log(error);
    }

  });//end ajax
  return result;
};
