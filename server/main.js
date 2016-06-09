/**
 * Created by aaron on 6/6/16.
 */
import getYoutube from './youtube.js';
import getGithub from './github.js';
import getStackexchange from './stackexchange.js';

// Make this more systematic and less hard-coded. Classes?
Meteor.methods({
    getYoutube: getYoutube,
    getGithub: getGithub,
    getStackexchange: getStackexchange
});

