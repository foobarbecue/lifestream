import { Lifestreams } from '../collections.js';
import { HTTP } from 'meteor/http';

const config = Meteor.settings.lifestream.services.github;

const getGithub = function() {
    //Unfortunately the github API only allows querying the last 90 days or 300 events, whichever comes first
    //Ask for 10 pages at 30 items per page (30pp is not changeable)
    for (page of [...Array(10).keys()]) {
        //TODO look into using ETag header
        HTTP.get(`https://api.github.com/users/${config.user}/events`,
            {
                headers: {"User-Agent": "Meteor/1.3"},
                params: {"page":page+1}
            },
            saveGithubData
        )
    }
};

const summaryHTML = function(item){
    switch (item.type){
        case "PushEvent":
            return `pushed ${item.payload.commits.length} 
                    commit(s)
                    to <a href=https://github.com/${item.repo.name}>${item.repo.name}</a>`;
        case "CreateEvent":
            return `created repository <a href=https://github.com/${item.repo.name}>${item.repo.name}</a>`;
        case "IssueCommentEvent":
            return `<a href=${item.payload.comment.html_url}>commented</a> on an issue in ${item.repo.name}`;
        case "IssuesEvent":
            return `${item.payload.action} an <a href=${item.payload.issue.html_url}>issue</a> in ${item.repo.name}`;
        case "PullRequestEvent":
            return `${item.payload.action} a <a href=${item.payload.pull_request.html_url}>pull request</a> in <a href=https://github.com/${item.repo.name}>${item.repo.name}</a>`;
        //TODO handle other event types e.g. issues
    }
};

const saveGithubData = function(error, response){
        for (item of response.data) {
            item['service'] = 'github';
            item['summaryHTML'] = summaryHTML(item);
            item['timestamp'] = new Date(item.created_at);
            Lifestreams.upsert({id: item.id}, item);
        }
};

export default getGithub;