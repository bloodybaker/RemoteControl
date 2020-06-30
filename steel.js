const Telegraf = require('telegraf')
const puppeteer = require('puppeteer');
const bot = new Telegraf('991609713:AAF3_AeWLrDlo3ZZKLKiOJdkX55vB8-2Lzw')
const request = require("request")
const allPlayers = new Map();

const ID_1 = 3434;
const KEY_1 = "564a29a0054b2b2f61cf0d9b4500d88a";
const ID_2 = 3461;
const KEY_2 = "70a0248ef27807968883b1620198e9e2";

var maps = ['awp_lego_2','awp_india','aim_deagle7k','$2000$','de_dust2','de_cache','de_mirage_csgo'];

bot.start((ctx) => {
    ctx.reply("Добро пожаловать. Вы авторизованы как: " + ctx.from.first_name + " " + ctx.from.last_name + " " + ctx.chat.id);
    return ctx.reply("Напишите /info для получения информации");
    console.log(ctx.from.id)

})


bot.command("/start_server",async (ctx) =>{
    if(ctx.from.username == "opcoder") {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let movieUrl = "http://cp.gamehost.com.ua/api.html?action=start&id=" + ID_1 + "&key=" + KEY_1;
        let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let page = await browser.newPage();
        await page.goto(movieUrl, {waitUntil: 'networkidle2'});
        await browser.close();

        let movieUrl1 = "http://cp.gamehost.com.ua/api.html?action=start&id=" + ID_2 + "&key=" + KEY_2;
        let browser1 = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let page1 = await browser1.newPage();
        await page1.goto(movieUrl1, {waitUntil: 'networkidle2'});
        await browser1.close();
        return ctx.reply("[" + time + "] " + "Сервер запущен администратором: " + ctx.from.first_name)
    }else {
        return ctx.reply("Вы не ст. администратор")
    }
})

bot.command("/stop_server",async (ctx) => {
    if(ctx.from.username == "opcoder"){
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let movieUrl = "http://cp.gamehost.com.ua/api.html?action=stop&id=" + ID_1 + "&key="+KEY_1;
        let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let page = await browser.newPage();
        await page.goto(movieUrl,{waitUntil:'networkidle2'});
        await browser.close();

        let movieUrl1 = "http://cp.gamehost.com.ua/api.html?action=stop&id=" + ID_1 + "&key="+KEY_1;
        let browser1 = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let page1 = await browser1.newPage();
        await page1.goto(movieUrl1,{waitUntil:'networkidle2'});
        await browser1.close();
        return ctx.reply("[" + time + "] " +"Работа остановлена администратором: " + ctx.from.first_name )
    }else {
        return ctx.reply("Вы не ст. администратор")
    }

})
bot.command("/info",(ctx) => {

    return ctx.reply("Список доступных комманд: \n" +
        "1. Запустить сервер /start_server\n" +
        "2. Остановить сервер /stop_server \n" +
        "3. Получить список игроков /users \n" +
        "4. Получить информацию про карту и кол-во игроков /online\n" +
        "5. Сменить карту /map" )
})
bot.command("/online",async (ctx) => {

    const url = "http://cp.gamehost.com.ua/api.html?action=status&id=" + ID_1 +"&key=" + KEY_1;
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        console.log("Map: " + body.info.map)
        ctx.reply("Steel Servers #1 [CS:Source]\n" +
            "Online: " + body.info.activeplayers + "\n" +
            "Map: " + body.info.map + "\n");

    })
    const url_2 = "http://cp.gamehost.com.ua/api.html?action=status&id=" + ID_2 +"&key=" + KEY_2;
    request({
        url: url_2,
        json: true
    }, function (error, response, body) {

        console.log("Map: " + body.info.map)
        ctx.reply("Steel Servers #2 [CS:Source]\n" +
            "Online: " + body.info.activeplayers + "\n" +
            "Map: " + body.info.map + "\n");

    })
})
bot.command("/map",async (ctx) => {

    bot.telegram.sendMessage(ctx.chat.id,'Выберите карту:',{
        reply_markup:{
            keyboard:[
                ['awp_lego_2','awp_india'],
                ['aim_deagle7k','$2000$'],
                ['de_dust2','de_cache'],
                ['de_mirage_csgo']
            ]
        }
    })
})
bot.command("/users",ctx => {

    const url = "http://cp.gamehost.com.ua/api.html?action=status&id=" + ID_1 +"&key=" + KEY_1;
    var userlist = "";
    allPlayers.clear();
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        for (i in body.players) {
            console.log(body.players[i].name);
            allPlayers.set(parseInt(i),body.players[i].name);
        }
        for (var [key, value] of allPlayers) {
            userlist += key + '. ' + value + "\n";
        }
        console.log("Data:" + userlist)
        ctx.reply("Steel Servers #1 [CS:Source]\n" + userlist);
    })
    userlist = "";
    allPlayers.clear();
    const url_1 = "http://cp.gamehost.com.ua/api.html?action=status&id=" + ID_2 +"&key=" + KEY_2;
    request({
        url: url_1,
        json: true
    }, function (error, response, body) {
        for (i in body.players) {
            console.log(body.players[i].name);
            allPlayers.set(parseInt(i),body.players[i].name);
        }
        for (var [key, value] of allPlayers) {
            userlist += key + '. ' + value + "\n";
        }
        console.log("Data:" + userlist)
        ctx.reply("Steel Servers #2 [CS:Source]\n" + userlist);
    })
    allPlayers.clear();
})
bot.on('message', async (ctx) =>{

    if(maps.indexOf(ctx.message.text) != -1){
        const url = "http://cp.gamehost.com.ua/api.html?action=map&id=" + ID_1 +"&key=" + KEY_1 + "&map=" + ctx.message.text;
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if(body.result === "OK"){
                ctx.reply("Администратор " + ctx.from.first_name + " " + ctx.from.last_name +" сменил карту на: " + ctx.message.text)
            }
        })
    }else {
        if (allPlayers.size == 0){
            ctx.reply("Сперва получите ID введя команду /users")
        }else {
            messageData = ctx.message.text.split(" ")
            console.log(allPlayers)
            console.log(allPlayers.get(Number(messageData[1])));
            if(messageData[0] == "/ban") {
                console.log("Есть")
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                let movieUrl = "http://cp.gamehost.com.ua/api.html?action=command&id=" + ID_1 + "&key=" + KEY_1 + "&command=sm_ban%20" + allPlayers.get(Number(messageData[1])) + "%200%20Тест%20Test"
                let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                let page = await browser.newPage();
                await page.goto(movieUrl, {waitUntil: 'networkidle2'});
                await browser.close();
                if (ctx.chat.id != -423897992) {
                    bot.telegram.sendMessage(-423897992, "[" + time + "] " + "Игрок " + allPlayers.get(Number(messageData[1])) + " забанен администратором: " + ctx.from.first_name)
                }
                return ctx.reply("[" + time + "] " + "Игрок " + allPlayers.get(Number(messageData[1])) + " забанен администратором: " + ctx.from.first_name)
            }
        }
    }
})
bot.startPolling()

