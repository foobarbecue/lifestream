import '../collections.js';
import { HTTP } from 'meteor/http';

const api_access_info = JSON.parse(Assets.getText('api_access_info.json'));

const getStackexchange = function() {
    //I ended up making this synchronous rather than async b/c weird problems with more_pages. TODO investigate
    let more_pages=true;
    let page=1;
    while (more_pages==true){
        //TODO look into using ETag header
         var response = HTTP.get(`http://api.stackexchange.com/2.2/users/${api_access_info.stackexchange.user_id}/network-activity`,
            {
                headers: {"User-Agent": "Meteor/1.3"},
                params: {"page":page},
                npmRequestOptions: {"gzip":true}
            },
        );
        for (item of response.data.items) {
            if (item.post_id) { //medals and privileges and such don't have post_ids, just forget them
                item['service'] = 'stackexchange';
                item['summaryHTML'] = summaryHTML(item);
                item['timestamp'] = new Date(item.creation_date*1000);
                Lifestreams.upsert({post_id: item.post_id}, item);
            }
        }
        page+=1;
        more_pages = response.data.has_more;
    }
};

const summaryHTML = function(item){
    const act_type = item.activity_type.replace('_',' ');
    return `<a href=${item.link}>${act_type}</a> on ${item.api_site_parameter}`;
};

export default getStackexchange;