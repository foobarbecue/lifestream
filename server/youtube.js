import './collections.js';
import { HTTP } from 'meteor/http';

const api_access_info = JSON.parse(Assets.getText('api_access_info.json'));

const getYoutube = function() {
    HTTP.get("https://www.googleapis.com/youtube/v3/playlistItems",
        {params:{
            part: "snippet",
            key: api_access_info.youtube.api_key,
            playlistId: api_access_info.youtube.playlistId
        }},
        saveYoutubeData
    )
};

const summaryHTML = function(ytItem){
    return `uploaded <a href=https://www.youtube.com/watch?v=${ytItem.snippet.resourceId.videoId}>${ytItem.snippet.title}</a>`};

const saveYoutubeData = function(error, response){
    for (item of response.data.items){
        item['service'] = 'youtube';
        item['summaryHTML'] = summaryHTML(item);
        item['timestamp'] = item.snippet.publishedAt;
        Lifestreams.upsert({etag:item.etag},item);
    };
};

export default getYoutube;