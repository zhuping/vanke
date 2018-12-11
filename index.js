const fs = require('fs');
const axios = require('axios');
const CronJob = require('cron').CronJob;
const Base64 = require('js-base64').Base64;
const md5 = require('js-md5');
var Console = require('console').Console;
var output = fs.createWriteStream('./stdout.log');
var logger = new Console(output);

const name = Base64.encode('Your Account');
const password = Base64.encode('Your Password');

const URL = 'https://union.vanke.com/api/Member/Login';


let timeStamp = (+new Date).toString(),
    nonce = 1e4 * Math.random(),
    clientOSType = 'ios',
    appId = 1003,
    appsecret = 'f150f9552b924a6c8d9cf01421784bc8';
let sign = "timestamp:" + timeStamp + "|nonce:" + nonce + "|appSecret:" + appsecret + "|clientOSType:" + clientOSType;

sign = md5(sign)

function start() {
    axios.post(URL, {
        body: {
            AccountName: name,
            LoginType: 1,
            Password: password
        },
        header: {
            accessToken: '',
            clientOSType: 'wechat',
            refreshToken: '',
            sign,
            version: '1.0'
        }
    }).then(resp => {
        let { AgentInfo } = resp.data.body
        logger.log(`====== ${AgentInfo.Name} ====== 签到成功`)
    }).catch(error => {
        logger.log('error', error);
    });
}

new CronJob('00 30 11 * * 0-6', function() {
  logger.log('============ %s ===========', new Date());
  start();
}, function() {
  logger.log('something goes error.');
}, true, 'Asia/Shanghai');