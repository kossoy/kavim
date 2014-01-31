if (Meteor.isClient) {

  Meteor.call('checkKavim', 'work', function(a, b) {
    console.log('work', a, b);
    if (b) {
      b = b.split(' ');
    }
    Session.set('etaHome', b[0]);
  });

  Meteor.call('checkKavim', 'home', function(a, b) {
    console.log('home', a, b);
    if (b) {
      b = b.split(' ');
    }
    Session.set('etaWork', b[0]);
  });

  Template.results.work = function() {
    return Session.get('etaWork');
  };

  Template.results.home = function() {
    return Session.get('etaHome');
  };

}

if (Meteor.isServer) {
  var target = {};
  Meteor.startup(function() {
    // code to run on server at startup
    target = {
      home: {
        direction: '1',
        code: '39246'
      },
      work: {
        direction: '2',
        code: '33711'        
      }
    };
    
  });

  Meteor.methods({

    checkKavim: function(direction) {

      try {
        var result = HTTP.get(
          "http://www.kavim-t.co.il/include/getWSNextBus.asp", {
            params: {
              'lineinfoWS': '641_n_8_0',
              'stationCode': target[direction].code,
              'Dir': target[direction].direction
            },
            headers: {
              'Content-type': 'text/html; charset=windows-1255'
            }
          }
        );
        var regx = /<span class=txtWSNextBusRes dir=rtl>(.*?)<\/span>/img,
          matches;

        if (result.content) {
          matches = regx.exec(result.content);
          if (matches && matches[1]) {
            console.log(result);
            return matches[1];
          } else {
            return 'No data, kavim sucks';
          }
        }

      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        console.log(e);
        return false;
      }
    }

  });
}