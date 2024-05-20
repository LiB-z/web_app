import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.filters import Command
from aiogram.types.web_app_info import WebAppInfo

bot = Bot(token='6850842462:AAEGPxJ6RiyKkJIEfetAdIMGnzXOXTNG1Uk')
dp = Dispatcher()

@dp.message(Command('start'))
async def start(message: Message):
    keyboard = ReplyKeyboardMarkup(keyboard=[[KeyboardButton(text='Создать претензию', web_app=WebAppInfo(url='https://lib-z.github.io/web_app/site/'))]],
                               resize_keyboard=True)
    inlineKeyboard = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text='Создать претензию', web_app=WebAppInfo(url='https://lib-z.github.io/web_app/site/'))]])
    await message.answer('Добрый день!', reply_markup=keyboard)
    await message.answer('Для создания претензии нажмите кнопку \"Создать претензию\"', reply_markup=inlineKeyboard)


async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())