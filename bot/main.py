import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.filters import Command
from aiogram.types.web_app_info import WebAppInfo
from os import environ
from dotenv import load_dotenv
load_dotenv()

TOKEN = environ["TOKEN"]

bot = Bot(token = TOKEN)
dp = Dispatcher()

@dp.message(Command('start'))
async def start(message: Message):
    inlineKeyboard = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text='Для физ.лиц', web_app=WebAppInfo(url='https://lib-z.github.io/web_app/web/pages/form-individual/?id=1212212'))]])
    inlineKeyboard_2 = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text='Для юр.лиц', web_app=WebAppInfo(url='https://lib-z.github.io/web_app/web/pages/form-legalEntity/'))]])
    inlineKeyboard_3 = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text='Для ИП', web_app=WebAppInfo(url='https://lib-z.github.io/web_app/web/pages/form-individualEntrepreneur/'))]])
    await message.answer('Добрый день!')
    await message.answer('Для ввода информации, пожалуйста, нажмите кнопку \"Заполнить персональные данные физ.лица\"', reply_markup=inlineKeyboard)
    await message.answer('Для ввода информации, пожалуйста, нажмите кнопку \"Заполнить персональные данные юр.лица\"', reply_markup=inlineKeyboard_2)
    await message.answer('Для ввода информации, пожалуйста, нажмите кнопку \"Заполнить персональные данные ИП\"', reply_markup=inlineKeyboard_3)


async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())