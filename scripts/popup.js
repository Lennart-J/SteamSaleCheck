var appIds_discount = [],
  appIds_discount_detailed = [];


var getDiscountedApps = function() {
  console.log('getDiscountedApps');
  chrome.storage.local.get(['discounted_apps_detailed'], function(items) {
    if (items.discounted_apps_detailed) {
      appIds_discount_detailed = items.discounted_apps_detailed;
      console.log(items.discounted_apps_detailed);
      /*sortElements(items.discounted_apps_detailed);
      console.log(items.discounted_apps_detailed);*/
      createElements(items.discounted_apps_detailed);
    } else {
      //TODO
      // try again after 10s
      console.warn('discounted_apps_detailed not in storage');
      setTimeout(getDiscountedApps, 10000);
    }
  });
};

function sortElements(sourceArray) {
  console.log("sortElements");
  sourceArray.sort(function(a, b) {
    return ((a.recommendations.total < b.recommendations.total) ? -1 : ((a.recommendations.total > b.recommendations.total) ? 1 : 0));
  });
}

function createElements(sourceArray) {
  var steamStoreAppUrl = "http://store.steampowered.com/app/",
    steamSmallCapsuleBaseUrl = "http://cdn.akamai.steamstatic.com/steam/apps/",
    steamSmallCapsuleAffix = "/capsule_sm_120.jpg",
    $resultContent = $('#result-content'),
    currency = "&euro;";

  console.log('createElements');

  $.each(sourceArray, function(index, value) {
    var isEven, aClass;
    console.log("each " + index + " ", value);
    isEven = index % 2 === 0 ? true : false;
    aClass = isEven === true ? 'even' : 'odd';
    //if (index <= 10) {
    $resultContent.append(
      $('<a>').addClass('result-row ' + aClass).attr('href', steamStoreAppUrl + value.appid)
      .append(
        $('<div>').addClass('col result-price')
        .append(
          $('<p>').append(
            $('<del>').html((value.price_overview.initial / 100).toFixed(2) + currency)
          )
        )
        .append(
          $('<p>').html((value.price_overview.final / 100).toFixed(2) + currency)
        )
      )
      .append(
        $('<div>').addClass('col result-discount').html(value.price_overview.discount_percent + "%")
      )
      .append(
        $('<div>').addClass('col result-capsule')
        .append(
          $('<img>').attr('src', steamSmallCapsuleBaseUrl + value.appid + steamSmallCapsuleAffix)
        )
      )
      .append(
        $('<div>').addClass('col result-name')
        .append(
          $('<h4>').html(value.name)
        )
      )
    );
    //}
  });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.info('Storage changed ', changes);
  //$.inArray('',changes)
});

//DOM Manipulation
$(document).ready(function() {
  $('a').on('click', function(e) {
    e.preventDefault();
    window.open($(this).attr('href'), 'SteamSalesCatcher');
  });

  getDiscountedApps();
});