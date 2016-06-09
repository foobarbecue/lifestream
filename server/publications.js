/**
 * Created by aaron on 6/8/16.
 */
import Lifestreams from '../collections.js';
//import 'meteor/reactive-aggregate'; // this package has no exports, but it creates function ReactiveAggregate

Meteor.publish("lifestreams", function(){
    ReactiveAggregate(this, Lifestreams, [{
        $group: {_id:"$service",items:{$push:"$$ROOT"}}
    }]);
});