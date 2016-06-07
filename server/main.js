/**
 * Created by aaron on 6/6/16.
 */
import getYoutube from './youtube.js';
import getGithub from './github.js';

Meteor.methods({
    getYoutube: getYoutube,
    getGithub: getGithub
});