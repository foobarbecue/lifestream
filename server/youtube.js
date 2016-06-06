import './collections.js';
import { HTTP } from 'meteor/http';

const api_access_info = JSON.parse(Assets.getText('api_access_info.json'));

const getYoutube = function() {
    console.log('stuff');
    HTTP.get("https://www.googleapis.com/youtube/v3/playlistItems",
        {params:{
            part: "snippet",
            key: api_access_info.youtube.api_key,
            playlistId: api_access_info.youtube.playlistId
        }},
        saveYoutubeData
    )
};

const saveYoutubeData = function(error, response){
    response['service'] = 'youtube';
    for (item of response.data.items){
        Lifestreams.upsert({etag:item.etag},item);
    };
};

export default getYoutube;