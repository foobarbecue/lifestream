/**
 * Created by aaron on 6/6/16.
 */
import { Mongo } from 'meteor/mongo';
export const Lifestreams = new Mongo.Collection('lifestreams');
export const MeteorBlogPosts = new Mongo.Collection('blog_posts',{_suppressSameNameError:true});