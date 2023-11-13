from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
import os
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import timedelta
from utils import send_mail, get_ya_users, contains_cyrillic, generate_verification_code
from werkzeug.security import generate_password_hash, check_password_hash
import threading
import uuid

from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'sqilte.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
app.permanent_session_lifetime = timedelta(hours=6)

db = SQLAlchemy(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(11))
    password = db.Column(db.String(11))

# with app.app_context():
#     db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.before_request
def before_request():
    device_id = request.headers.get('Device-ID')
    if not device_id:
        device_id = str(uuid.uuid4())
        session['device_id'] = device_id

        # Проверяем текущий сеанс пользователя
    if current_user.is_authenticated and 'device_id' in session:
        if session['device_id'] != device_id:
            # Если текущий сеанс не соответствует ожидаемому, выходим пользователя
            logout_user()
            return redirect(url_for('login'))

# вход
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            session.permanent = True 
            # Сохраняем идентификатор устройства в сессии
            session['device_id'] = str(uuid.uuid4())
            return redirect(url_for('cash_regs'))
        else:
            error = 'Неправильный логин или пароль'
            return render_template('login.html', error=error)
    return render_template('login.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

# кассы
@app.route('/cash_regs', methods=['GET', 'POST'])
@login_required
def cash_regs():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    if request.method == 'POST':
        shop_number = request.form['shop_number']
        shop_address = request.form['shop_address']
        shop_ip = request.form['shop_ip']
        cash_reg_type = request.form['cash_reg_type']
        message = f'''<b>Данные инженера.</b><br/>
Имя: <b>{current_user.name}</b><br/>
Почта: <b>{current_user.email}</b><br/>
Телефон: <b>{current_user.phone}</b><br/>
<br/>
<b>Информация о магазине.</b><br/>
Номер магазина: <b>{shop_number}</b><br/>
Адрес: <b>{shop_address}</b><br/>
IP: <b>{shop_ip}</b><br/>
<br/>
<br/>
<b>Информация о кассах.</b><br/>
Тип касс: <b>{cash_reg_type}</b><br/><br/>
'''
        
        count = 1
        while True:
            try:
                cash_reg_number = request.form[f'cash_reg_number_{count}']
                cash_reg_config = request.form[f'cash_reg_config_{count}']
                cash_reg_po = request.form[f'cash_reg_po_{count}']
                scale_model = request.form[f'scale_model_{count}']
                if scale_model == 'Другая модель':
                    scale_model = request.form[f'scale_another_model_{count}']
                if cash_reg_type == 'КСО' or cash_reg_type == 'КСК': 
                    atol_v = request.form[f'atol_v_{count}']
                    shop_fr = request.form[f'shop_fr_{count}']
                    shop_ecv = request.form[f'shop_ecv_{count}']
                    atol = f'Версия Atol: <b>{atol_v}</b><br/>'
                    cash_reg_fr = f'ФР: <b>{shop_fr}</b><br/>'
                    cash_reg_ecv = f'Эквайринг: <b>{shop_ecv}</b><br/>'
                else:
                    atol = ''
                    cash_reg_fr = ''
                    cash_reg_ecv = ''
                teamviewer_id = request.form[f'teamviewer_id_{count}']
                cash_reg_pass = request.form[f'cash_reg_pass_{count}']
                if cash_reg_pass == 'Другой':
                    cash_reg_pass = request.form[f'cash_another_reg_pass_{count}']
                cash_reg_not = request.form[f'cash_reg_not_{count}']

                message += f'''Касса номер <b>{cash_reg_number}</b><br/>
Конфигурация: <b>{cash_reg_config}</b><br/>
{cash_reg_fr}
{cash_reg_ecv}
ПО: <b>{cash_reg_po}</b><br/>
Модель весов: <b>{scale_model}</b><br/>
{atol}
ID TeamViewer: <b>{teamviewer_id}</b><br/>
Пароль: <b>{cash_reg_pass}</b><br/>
Примечание: <b>{cash_reg_not}</b><br/>
<br/>
<br/>
'''

                count += 1
            except Exception as e:
                print(e)
                break
        
        email = os.environ.get('EMAIL_SEND_TO')
        subject = f'ВкусВилл Кассы: {shop_number}'
        thread = threading.Thread(target=send_forms_info, args=(email, subject, message))
        thread.start()
        return redirect(url_for('cash_regs'))
    
    return render_template('cash_regs.html')

@app.route('/cold', methods=['GET', 'POST'])
@login_required
def cold():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    if request.method == 'POST':
        shop_number = request.form['shop_number']
        shop_address = request.form['shop_address']
        try:
            file = request.files['file']
        except Exception as e:
            print(e)
            file = None
        
        message = f'''<b>Данные инженера.</b><br/>
Имя: <b>{current_user.name}</b><br/>
Почта: <b>{current_user.email}</b><br/>
Телефон: <b>{current_user.phone}</b><br/>
<br/>
<b>Информация о магазине.</b><br/>
Номер магазина: <b>{shop_number}</b><br/>
Адрес: <b>{shop_address}</b><br/>
<br/>
<br/>
<b>Информация о датчиках холода.</b><br/>
'''
        count = 1
        while True:
            try:
                fridge_groups = request.form[f'fridge_groups_{count}']
                fridge_name = request.form[f'fridge_name_{count}']
                if fridge_name == 'Другое':
                    fridge_name = request.form[f'another_fridge_name_{count}']
                    fridge = f'Название холодильника: <b>{fridge_name}</b><br/>'
                else:
                    fridge = ''
                cold_address = request.form[f'cold_address_{count}']
                sticker_number = request.form[f'sticker_number_{count}']

                message += f'''Группа холодильников <b>{fridge_groups}</b><br/>
{fridge}
Адрес датчика: <b>{cold_address}</b><br/>
Номер на зеленой наклейке: <b>{sticker_number}</b><br/>
<br/>
<br/>

'''         
                count += 1
            except Exception as e:
                print(e)
                break
        
        email = os.environ.get('EMAIL_SEND_TO')
        subject = f'ВкусВилл Датчики холод: {shop_number}'
        thread = threading.Thread(target=send_forms_info, args=(email, subject, message, file))
        thread.start()
        return redirect(url_for('cold'))
    return render_template('cold.html')

@app.route('/cameras', methods=['GET', 'POST'])
@login_required
def cameras():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    if request.method == 'POST':
        shop_number = request.form['shop_number']
        shop_address = request.form['shop_address']
        subnet = request.form['subnet']
        message = f'''<b>Данные инженера.</b><br/>
Имя: <b>{current_user.name}</b><br/>
Почта: <b>{current_user.email}</b><br/>
Телефон: <b>{current_user.phone}</b><br/>
<br/>
<b>Информация о магазине.</b><br/>
Номер магазина: <b>{shop_number}</b><br/>
Адрес: <b>{shop_address}</b><br/>
Подсеть: <b>{subnet}</b><br/>
<br/>
<br/>
<b>Информация о камерах.</b><br/>
'''
        count = 1
        while True:
            try:
                camera_number = request.form[f'camera_number_{count}']
                manufacturer = request.form[f'manufacturer_{count}']
                watch_for = request.form[f'watch_for_{count}']
                if watch_for == 'Другое':
                    watch_for = request.form[f'another_watch_for_{count}']
                    watch = f'Куда смотрит: <b>{watch_for}</b><br/>'
                else:
                    watch = ''

                message += f'''Номер камеры <b>{camera_number}</b><br/>
Производитель: <b>{manufacturer}</b><br/>
{watch}
<br/>
<br/>

'''         
                count += 1
            except Exception as e:
                print(e)
                break
        
        email = os.environ.get('EMAIL_SEND_TO')
        subject = f'ВкусВилл Камеры: {shop_number}'
        thread = threading.Thread(target=send_forms_info, args=(email, subject, message))
        thread.start()
        return redirect(url_for('cold'))
    return render_template('cameras.html')

# главная
@app.route('/', methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        return redirect(url_for('cash_regs'))
    else:
        return redirect(url_for('login'))

# профиль
@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    if request.method == 'POST':
        name = request.form.get('name')
        phone = request.form.get('phone')
        password = request.form.get('password')
        password_confirmation = request.form.get('password_confirmation')
        user = User.query.filter_by(email=current_user.email).first()
        if password_confirmation or password:
            if password!= password_confirmation:
                error = 'Пароли не совпадают'
                return render_template('profile.html', error=error, 
                                    fio=current_user.name, phone=current_user.phone)
            else:
                if len(password) < 8:
                    error = 'Пароль должен быть не менее 8 символов.'
                    return render_template('profile.html', error=error, 
                                        fio=current_user.name, phone=current_user.phone)
                if contains_cyrillic(password):
                    error = 'Пароль должен содержать только латинские буквы и цифры, символы.'
                    return render_template('profile.html', error=error, 
                                        fio=current_user.name, phone=current_user.phone)
            password_hash = generate_password_hash(password)
            user.password = password_hash
        if name: user.name = name
        if phone: user.phone = phone
        db.session.commit()
        return redirect(url_for('profile'))
    return render_template('profile.html', fio=current_user.name, phone=current_user.phone)

# регистрация
@app.route('/register', methods=['GET', 'POST'])
def register():
    if not current_user.is_authenticated:
        if request.method == 'POST':
            name = request.form['name']
            email = request.form['email']
            phone = request.form['phone']
            password = request.form['password']
            password_confirmation = request.form['password_confirmation']
            users = get_ya_users()
            is_there = False
            for user in users:
                if user.get('email') == email:
                    is_there = True
                    break
            if not is_there:
                error = 'Вы должны быть сотрудником компании'
                return render_template('register.html', error=error)
            if password != password_confirmation:
                error = 'Пароли не совпадают.'
                return render_template('register.html', error=error)
            else:
                if len(password) < 8:
                    error = 'Пароль должен быть не менее 8 символов.'
                    return render_template('register.html', error=error)
                if contains_cyrillic(password):
                    error = 'Пароль должен содержать только латинские буквы и цифры, символы.'
                    return render_template('register.html', error=error)
                user = User.query.filter_by(email=email).first()
                if user:
                    error = 'Пользователь с таким email уже существует.'
                    return render_template('register.html', error=error)
                else:
                    verification_code = generate_verification_code()
                    # Сохраните данные в сессии
                    session['registration_data'] = {
                        'name': name,
                        'email': email,
                        'phone': phone,
                        'password': password,
                        'verification_code': verification_code
                    }
                    # Сохраните код верификации в сессии
                    session['verification_code'] = verification_code
                    thread = threading.Thread(target=send_verification_email, args=(email, verification_code))
                    thread.start()
                    return redirect(url_for('reg_verify', email=email))

        return render_template('register.html')
    else:
        return redirect(url_for('cash_regs'))

@app.route('/reg_verify/<email>', methods=['GET', 'POST'])
def reg_verify(email):
    if session.get('registration_data'):
        user_data = session['registration_data']
        if request.method == 'POST':
            code = request.form['verification_code']
            verification_code = session.get('verification_code')
            if code == verification_code:
                password_hash = generate_password_hash(user_data['password'])
                new_user = User(name=user_data['name'], email=email, phone=user_data['phone'], 
                                password=password_hash)
                db.session.add(new_user)
                db.session.commit()

                login_user(new_user)

                session.pop('registration_data', None)
                session.pop('verification_code', None)

                return redirect(url_for('cash_regs'))
            else:
                error = 'Неправильный код подтверждения'
                return render_template('reg_verify.html', email=email, error=error)
        return render_template('reg_verify.html', email=email)
    else:
        return redirect(url_for('register'))

def send_verification_email(email, code):
    email_address = os.environ.get('EMAIL_USER')
    email_password = os.environ.get('EMAIL_PASSWORD')
    subject = 'VV-Формы. Код подтверждения'
    text = f'Ваш код подтверждения: {code}'
    send_mail(email_address, email_password, email, subject, text)

def send_forms_info(email, subject, message, file=None):
    email_address = os.environ.get('EMAIL_USER')
    email_password = os.environ.get('EMAIL_PASSWORD')
    send_mail(email_address, email_password, email, subject, message, attachment=file)


# восстановление пароля
@app.route('/recovery_pass', methods=['GET', 'POST'])
def recovery_pass():
    if not current_user.is_authenticated:
        if request.method == 'POST':
            email = request.form.get('email')
            users = get_ya_users()
            is_there = False
            for user in users:
                if user.get('email') == email:
                    is_there = True
                    break
            if not is_there:
                error = 'Вы должны быть сотрудником компании'
                return render_template('recovery_pass.html', error=error)
            user = User.query.filter_by(email=email).first()
            if not user:
                error = 'Пользователь с таким email не найден'
                return render_template('recovery_pass.html', error=error)
            code = generate_verification_code()
            session['verification_code'] = code

            thread = threading.Thread(target=send_verification_email, args=(email, code))
            thread.start()

            return redirect(url_for('verify_rec_pass', email=email))
        return render_template('recovery_pass.html')
    else:
        return redirect(url_for('cash_regs'))
    

@app.route('/verify_rec_pass/<email>', methods=['GET', 'POST'])
def verify_rec_pass(email):
    if session.get('verification_code'):
        if request.method == 'POST':
            code = request.form['verification_code']
            verification_code = session.get('verification_code')
            if code == verification_code:
                session.pop('verification_code', None)
                session['email'] = email
                return redirect(url_for('new_pass'))
            else:
                error = 'Неправильный код подтверждения'
                return render_template('verify_rec_pass.html', email=email, error=error)
        return render_template('verify_rec_pass.html', email=email)
    else:
        return redirect(url_for('recovery_pass'))

@app.route('/new_pass', methods=['GET', 'POST'])
def new_pass():
    if session.get('email'):
        email = session.get('email')
        if request.method == 'POST':
            password = request.form.get('password')
            password_confirmation = request.form.get('password_confirmation')
            if password != password_confirmation:
                error = 'Пароли не совпадают.'
                return render_template('new_pass.html', error=error)
            else:
                if len(password) < 8:
                    error = 'Пароль должен быть не менее 8 символов.'
                    return render_template('new_pass.html', error=error)
                if contains_cyrillic(password):
                    error = 'Пароль должен содержать только латинские буквы и цифры и символы.'
                    return render_template('new_pass.html', error=error)
                user = User.query.filter_by(email=email).first()
                if user:
                    if check_password_hash(user.password, password):
                        error = 'Пароль не должен совпадать с текущим.'
                        return render_template('new_pass.html', error=error)
                    else:
                        user.password = generate_password_hash(password)
                        db.session.commit()
                        session.pop('email', None)
                        return redirect(url_for('login'))
        return render_template('new_pass.html', email=email)
    else:
        return redirect(url_for('recovery_pass'))
    

if __name__ == "__main__":
    app.run(host='0.0.0.0')