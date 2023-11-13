import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import requests
import re
import random
import string


def send_mail(email_address, email_password, to_email, subject, message_text, attachment=None):
    msg = MIMEMultipart()
    msg['From'] = email_address
    msg['To'] = to_email
    msg['Subject'] = subject
    
    message_text = MIMEText(message_text, 'html', 'utf-8')
    msg.attach(message_text)

    if attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment', filename=attachment.filename)
        msg.attach(part)

    smtp_server = os.environ.get('EMAIL_SERVER')
    smtp_port = int(os.environ.get('EMAIL_PORT'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_address, email_password)

        server.sendmail(email_address, to_email, msg.as_string().encode('utf-8'))
        print('Письмо успешно отправлено')

        server.quit()
    except Exception as e:
        print('Произошла ошибка при отправке письма:', str(e))


url_api = 'https://api360.yandex.net'
ORG_ID = 3343733
TOKEN = 'y0_AgAEA7qjIo4JAAptpwAAAADrmbO9QhRBzacVTZG3bmL-pDM_LlScIg0'

def get_ya_users():
    '''Получим список всех пользователей из YandexAPI '''
    params = {
        # Описание параметров запроса:
        # https://yandex.ru/dev/api360/doc/ref/UserService/UserService_List.html
        # срок жизни токена 1 год (истечет 01.09.2024)
        # обновить токен
        # https://oauth.yandex.ru/authorize?response_type=token&client_id=<идентификатор приложения>
        # 'fields': 'is_enabled,email',
        'perPage': 1000,
        'page': 1
    }
    headers = {
        'Authorization': 'OAuth ' + TOKEN,
        'Accept': 'application/json'
    }
    response = requests.get(
        f'{url_api}/directory/v1/org/{ORG_ID}/users?',
        params=params,
        headers=headers,
        timeout=10,
    )
    response.raise_for_status()
    response_data = response.json()
    return response_data.get('users')


def contains_cyrillic(text):
    # Используем регулярное выражение для поиска кириллических символов
    cyrillic_pattern = re.compile('[а-яА-Я]')
    return cyrillic_pattern.search(text) is not None


def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))