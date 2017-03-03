const Redis = require("ioredis");
import {Store} from "koa-session2";
var util = require('util');
const config = require('../config/config.js');
export default class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis(config.redis);
    }
    async get(sid) {
        let session = await this.redis.get(`SESSION:${sid}`);
        if(session){
            session = JSON.parse(session);
            this.redis.expireat(`SESSION:${sid}`, parseInt(Date.now() / 1000) + config.ttl).then((result) => {
                console.log('ttl change: ' + result);
            }, (error) => {
                console.log(error);
            }); 
        } else {
            session = {};
        }
        return session;
    }
    async set(session, opts) {
        if(!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session), 'EX', config.ttl);
        return opts.sid;
    }
    async destroy(sid) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}
