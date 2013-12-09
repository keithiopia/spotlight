define([
  'extensions/views/view',
  'common/views/visualisations/single_stat',
  'stache!common/templates/visualisations/multi_stats',
  'Mustache'
],
function (View, SingleStat, template, Mustache) {
  var MultiStatsView = View.extend({

    template: template,
    
    render: function() { 
      console.log('MultiStatsView render, collection', this.collection);
        View.prototype.render.apply(this, arguments);
        
        var ul = this.$el.find('ul');
        _.each(this.getStats(), function(d) {
          var el = $('<li>').appendTo(ul);
          view = new SingleStat({
            'collection': this.collection, 
            'stat': d,
            'el': el
          });
          view.render();
        }, this);
    }, 

    getStats: function() { 

      var stats = [];
      if (this.collection.length) {
        stats = this.model.get('stats');
      }
      console.log('getStats', stats);
      return stats;
      
    }

  });
  return MultiStatsView;
});