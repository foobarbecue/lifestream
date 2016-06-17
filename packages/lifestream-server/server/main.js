/**
 * Created by aaron on 6/6/16.
 */
import getYoutube from './youtube.js';
import getGithub from './github.js';
import getStackexchange from './stackexchange.js';
import getMeteorBlog from './meteorblog.js';
import './publications.js';
const config = Meteor.settings.lifestream;

// TODO make this more systematic and less hard-coded. Classes?
Meteor.methods({
    get_youtube: getYoutube,
    get_github: getGithub,
    get_stackexchange: getStackexchange,
    get_meteorblog: getMeteorBlog
});

SyncedCron.add({
    name: 'Request all lifestreams',
    schedule: (parser) => parser.text(config.interval),
    job: () => {
        for (service of Object.keys(config.services)){
            Meteor.call('get_' + service)
        }
    }
});

SyncedCron.start();