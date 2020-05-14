const Telegraf = require('telegraf')
const puppeteer = require('puppeteer');
const bot = new Telegraf('991609713:AAF3_AeWLrDlo3ZZKLKiOJdkX55vB8-2Lzw')
const request = require("request")
const allPlayers = new Map();

const ID = 3434;
const KEY = "564a29a0054b2b2f61cf0d9b4500d88a";


bot.start((ctx) => {
    ctx.reply("Добро пожаловать. Вы авторизованы как: " + ctx.from.first_name + " " + ctx.from.last_name + " " + ctx.chat.id);
    return ctx.reply("Напишите /info для получения информации");
    console.log(ctx.from.id)

})


bot.command("/start_server",async (ctx) =>{
    if(ctx.from.username == "opcoder") {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let movieUrl = "http://cp.gamehost.com.ua/api.html?action=start&id=" + ID + "&key=" + KEY;
        let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let page = await browser.newPage();
        await page.goto(movieUrl, {waitUntil: 'networkidle2'});
        await browser.close();

        return ctx.reply("[" + time + "] " + "Сервер запущен администратором: " + ctx.from.first_name)
    }else {
        return ctx.reply("Вы не ст. администратор")
    }
})
bot.command("/stop_server",async (ctx) => {
    if(ctx.from.username == "opcoder"){
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let movieUrl = "http://cp.gamehost.com.ua/api.html?action=stop&id=" + ID + "&key="+KEY;
        let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let page = await browser.newPage();
        await page.goto(movieUrl,{waitUntil:'networkidle2'});
        await browser.close();

        return ctx.reply("[" + time + "] " +"Работа остановлена администратором: " + ctx.from.first_name )
    }else {
        return ctx.reply("Вы не ст. администратор")
    }

})
bot.command("/info",(ctx) => {

    return ctx.reply("Список доступных комманд: \n1. Запустить сервер /start_server\n2. Остановить сервер /stop_server \n3. Получить список игроков /users \n4. Выдать бан: /ban [index] (Работает в личку)")
})
bot.command("/data",async (ctx) => {

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let movieUrl = "http://cp.gamehost.com.ua/api.html?action=stop&id="+ ID + "&key=" + KEY;
    let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    let page = await browser.newPage();
    await page.goto(movieUrl,{waitUntil:'networkidle2'});
    await browser.close();

    return ctx.reply("[" + time + "] " +"Работа остановлена администратором: " + ctx.from.first_name )
})
bot.command("/users",ctx => {

    const url = "http://cp.gamehost.com.ua/api.html?action=status&id=" + ID +"&key=" + KEY;
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
            //console.log(key + '. ' + value + "\n");
            userlist += key + '. ' + value + "\n";
        }
        console.log("Data:" + userlist)
        ctx.reply(userlist);

    })

})
bot.on('message', async (ctx) =>{
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
            let movieUrl = "http://cp.gamehost.com.ua/api.html?action=command&id=" + ID + "&key=" + KEY + "&command=sm_ban%20" + allPlayers.get(Number(messageData[1])) + "%200%20Тест%20Test"
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
})
bot.startPolling()

