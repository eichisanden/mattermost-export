$(function() {
  var $selectTeamId = $("#teamId");
  var $selectChannelId = $("#channelId");
  $selectTeamId.change(function() {
    var teamId = $(this).val();
    $.get('/changeTeam', {teamId: teamId}, function(data) {
      $selectChannelId.children("option").remove();
      for (var channel of data.channels) {
        console.log(channel);
        $selectChannelId.append($("<option>").html(channel.name).val(channel.id));
      }
    });
  });
});

