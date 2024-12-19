require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const markup = require('telegraf/markup');
const COUNTRIES_LIST = require(`./constants`);
const bot = new Telegraf('1184776458:AAENF915hgjUKBOBw1sg1aMY0P70Avpjwxw');
// const bot = new Telegraf('468681121:AAFJe6BJRh7uWfBMOQNXOQFUL5TKEejevb4');
// const bot = new Telegraf(process.env.BOT_TOKEN);


require('https')
  .createServer()
  .listen(process.env.PORT || 5000)
  .on('request', function (req, res) {
    res.end('');
  });

bot.start((ctx) =>
  ctx.reply(
    `
Привет ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу.
Введи на англ. название страны и получи статистику.
Посмотреть название всех стран: .
`,
    markup
      .keyboard([
        [`Ukraine`, `Russia`],
        [`US`, `China`],
        [`Открыть карту Тинькофф`], // Добавлено: кнопка "оплатить"
      ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

let count = 0; // Переменная для отслеживания количества запросов

bot.on('text', async (ctx) => {
  count++; // Увеличиваем счетчик при каждом запросе
  let data = {};

  if (count % 3 === 0) { // Проверяем, является ли текущий запрос третьим
    if (count === 3) { // Проверяем, является ли текущий запрос третьим точно
      ctx.reply('https://www.tinkoff.ru/sl/5BN9Xyh1LNS'); // Выводим ссылку после третьего запроса
    }
  } else {
    try {
      data = await api.getReportsByCountries(ctx.message.text);

      const formatData = `
        Страна: ${data[0][0].country}
        Заболевшие: ${data[0][0].cases}
        Смертей: ${data[0][0].deaths}
        Вылечились: ${data[0][0].recovered}
      `;
      ctx.reply(formatData);
    } catch {
      ctx.reply(`Ошибка: такой страны нет. Смотри /help`);
    }
  }
});

bot.launch();
console.log(`Бот запущен`);

