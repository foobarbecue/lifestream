import { Lifestreams, MeteorBlogPosts } from '../collections.js';

//Assumes that your meteor-blog data is in the same database

const config = Meteor.settings.lifestream.services.meteorblog;

const getMeteorBlog = function() {
    //Unfortunately the github API only allows querying the last 90 days or 300 events, whichever comes first
    //Ask for 10 pages at 30 items per page (30pp is not changeable)
    for (item of MeteorBlogPosts.find({'mode':'public'}).fetch()){
        item['service'] = config.service_name;
        item['summaryHTML'] = `Created entry: <a href=/entry/${item.slug}>${item.title}</a>`;
        item['timestamp'] = new Date(item.createdAt);
        item.orig_id = item._id;
        delete item._id; //We don't want the meteor blog id becoming the id of the lifestream event for it
        Lifestreams.upsert({orig_id: item.orig_id}, item);
    };
};

export default getMeteorBlog;