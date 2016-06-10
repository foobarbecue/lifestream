import '../collections.js';
import { HTTP } from 'meteor/http';

const config = JSON.parse(Assets.getText('lifestream_config.json')).services.youtube;

const getYoutube = function() {
    let pageToken='';
    while(pageToken || pageToken=='') {
        let response = HTTP.get("https://www.googleapis.com/youtube/v3/playlistItems",
            {
                params: {
                    part: "snippet",
                    key: config.api_key,
                    playlistId: config.playlistId,
                    pageToken: pageToken,
                    maxResults: 50 //This is the most you're allowed to request
                }
            },
        );
        pageToken = response.data.nextPageToken;
        saveYoutubeData(response);
    };
};

const summaryHTML = function(ytItem){
    return `uploaded <a href=https://www.youtube.com/watch?v=${ytItem.snippet.resourceId.videoId}>${ytItem.snippet.title}</a>`};

const saveYoutubeData = function(response){
    for (item of response.data.items){
        item['service'] = 'youtube';
        item['summaryHTML'] = summaryHTML(item);
        item['timestamp'] = new Date(item.snippet.publishedAt);
        Lifestreams.upsert({etag:item.etag},item);
    };
};

export default getYoutube;