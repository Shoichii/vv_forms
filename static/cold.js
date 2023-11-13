const wrapper = document.querySelector('.wrapper');
wrapper.style.height = 'auto'

const forms = document.querySelector('.cash-regs-froms')
const cashRegType = document.querySelector('.cash_reg_type')
//счётчик количества датчиков
let countCashRegs = 1

const createNewCashReg = (number) => {

    const cashRegWrapper = document.createElement('div');
    cashRegWrapper.classList.add('cash_regs_wrapper_' + number);
    cashRegWrapper.classList.add('style_cash_regs_wrapper');
    cashRegWrapper.innerHTML = `<div class="login-field">
    <p class="field-title">Группы холодильников *</p>
    <select class="field cash_reg_type" name="fridge_groups_${number}" required>
        <option></option>
        <option value="Заморозка">Заморозка</option>
        <option value="Мясная гастрономия">Мясная гастрономия</option>
        <option value="Молочка">Молочка</option>
        <option value="Мясо/Рыба охлажденка">Мясо/Рыба охлажденка</option>
        <option value="Рыбная гастрономия">Рыбная гастрономия</option>
        <option value="Овощи и фрукты">Овощи и фрукты</option>
        <option value="Теплые стеллажи нонфуд">Теплые стеллажи нонфуд</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">Название холодильника *</p>
    <select class="field cash_reg_type" name="fridge_name_${number}" required >
        <option></option>
        <option value="Заморозка ">Заморозка </option>
        <option value="Банета заморозка">Банета заморозка</option>
        <option value="Заморозка(Подсобка) ">Заморозка(Подсобка) </option>
        <option value="Молочка">Молочка</option>
        <option value="Молочка(Подсобка)">Молочка(Подсобка)</option>
        <option value="Сыры">Сыры</option>
        <option value="Кулинария">Кулинария</option>
        <option value="Мясная гастрономия ">Мясная гастрономия </option>
        <option value="Веган">Веган</option>
        <option value="Гастрономия">Гастрономия</option>
        <option value="Напитки">Напитки</option>
        <option value="Мясо/Рыба охлажденка ">Мясо/Рыба охлажденка </option>
        <option value="ФРОВ(Подсобка) ">ФРОВ(Подсобка) </option>
        <option value="Фрукты/Овощи">Фрукты/Овощи</option>
        <option value="Рыбная гастрономия">Рыбная гастрономия</option>
        <option value="Икра">Икра</option>
        <option value="Другое">Другое</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">Адрес датчика *</p>
    <input class="field" type="text" name="cold_address_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Номер на зеленой наклейке *</p>
    <input class="field" type="text" name="sticker_number_${number}" required/>
</div>
<div class="add_or_del_cash_reg">
    <p class="add_cash_reg_${number}">Добавить</p>
    <p class="del_cash_reg_${number} hide-button">Удалить</p>
</div>`

    return cashRegWrapper;

}

forms.appendChild(createNewCashReg(1))

// добавление кассы
const addCashReg = () => {
    ++countCashRegs
    forms.appendChild(createNewCashReg(countCashRegs))
    const cashDels = document.querySelectorAll('[class^="del_cash_reg_"]')
    if (countCashRegs > 1) {
        for (let i = 0; i < cashDels.length; i++) {
            cashDels[i].classList.remove('hide-button')
        }
    }
}

// перенумерация имени элемента
const changeNameNumber = (elem, i) => {
    let currentName = elem.getAttribute('name');
    let newName = currentName.slice(0, -1) + `${i + 1}`;
    elem.setAttribute('name', newName)
}

//удаление кассы
const delCashReg = (number) => {
    --countCashRegs
    const cashReg = document.querySelector(`.cash_regs_wrapper_${number}`)
    cashReg.remove()
    const cashRegs = document.querySelectorAll('[class^="cash_regs_wrapper_"]')

    for (let i = 0; i < countCashRegs; i++) {
        // перенумерация главного родителя
        let currentClass = cashRegs[i].getAttribute('class').split(' ');
        currentClass.forEach(item => cashRegs[i].classList.remove(item))
        let newClass = currentClass[0].slice(0, -1) + `${i + 1}`;
        currentClass[0] = newClass
        currentClass.forEach(item => cashRegs[i].classList.add(item))

        // перенумерация группы холодильника
        let elem = cashRegs[i].querySelector('[name^="fridge_groups_"]')
        changeNameNumber(elem, i)

        // перенумерация названия холодильника
        elem = cashRegs[i].querySelector('[name^="fridge_name_"]')
        changeNameNumber(elem, i)

        // перенумерация другого имени холодильника
        elem = cashRegs[i].querySelector('[name^="another_fridge_name_"]')
        if (elem) changeNameNumber(elem, i)


        // перенумерация адреса датчика
        elem = cashRegs[i].querySelector('[name^="cold_address_"]')
        changeNameNumber(elem, i)


        // перенумерация номера на наклейке
        elem = cashRegs[i].querySelector('[name^="sticker_number"]')
        changeNameNumber(elem, i)


        // перенумерация добавления
        elem = cashRegs[i].querySelector('[class^="add_cash_reg_"]')
        currentClass = elem.getAttribute('class').split(' ')
        currentClass.forEach(item => elem.classList.remove(item))
        newClass = currentClass[0].slice(0, -1) + `${i + 1}`;
        currentClass[0] = newClass
        currentClass.forEach(item => elem.classList.add(item))

        // перенумерация удаления
        elem = cashRegs[i].querySelector('[class^="del_cash_reg_"]')
        currentClass = elem.getAttribute('class').split(' ')
        currentClass.forEach(item => elem.classList.remove(item))
        newClass = currentClass[0].slice(0, -1) + `${i + 1}`;
        currentClass[0] = newClass
        currentClass.forEach(item => elem.classList.add(item))
        if (countCashRegs == 1) elem.classList.add('hide-button')
    }
}

const formsClicks = (e) => {
    let add = e.target.closest('[class^="add_cash_reg_"]')
    let del = e.target.closest('[class^="del_cash_reg_"]')

    // клик на добавление кассы
    if (add) {
        addCashReg()
    }
    // клик на удаление кассы
    if (del) {
        if (countCashRegs > 1) {
            let classElements = del.getAttribute('class').split(' ')[0].split('_')
            let number = classElements[classElements.length - 1]
            delCashReg(number)
        }
    }

}

const formsChanges = (e) => {
    let fridge_name = e.target.closest('[name^="fridge_name_"]')
    // клик для появления/удаление дополнительного поля названия холодильника
    if (fridge_name && fridge_name.value == 'Другое') {
        let nameElements = fridge_name.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherModel = document.querySelector(`[name^="another_fridge_name_${number}"]`)
        if (!anotherModel) {
            const newAnotherModel = document.createElement('div')
            newAnotherModel.classList.add('login-field')
            newAnotherModel.innerHTML = `<p class="field-title">Введите название холодильника *</p>
        <input class="field" type="text" name="another_fridge_name_${number}" required/>`
            fridge_name.parentNode.insertBefore(newAnotherModel, fridge_name.nextSibling)
        }
    } else if (fridge_name && fridge_name.value != 'Другая модель') {
        let nameElements = fridge_name.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherModel = document.querySelector(`[name^="another_fridge_name_${number}"]`)
        if (anotherModel) {
            const fieldForDel = anotherModel.closest('.login-field')
            if (anotherModel) fieldForDel.remove()
        }
    }
}

forms.addEventListener('change', e => formsChanges(e))
forms.addEventListener('click', e => formsClicks(e))