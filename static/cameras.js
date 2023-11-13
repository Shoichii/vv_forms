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
    <p class="field-title">Номер камеры  *</p>
    <input class="field" type="text" name="camera_number_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Производитель камеры *</p>
    <input class="field" type="text" name="manufacturer_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Куда смотрит *</p>
    <select class="field cash_reg_type" name="watch_for_${number}" required >
        <option></option>
        <option value="Кассы фронт">Кассы фронт</option>
        <option value="Кассы тыл">Кассы тыл</option>
        <option value="КСО">КСО</option>
        <option value="Зона Кафе">Зона Кафе</option>
        <option value="АДМ">АДМ</option>
        <option value="Заморозка">Заморозка</option>
        <option value="Мясная гастрономия ">Мясная гастрономия</option>
        <option value="Рыбная гастрономия">Рыбная гастрономия</option>
        <option value="Молочка">Молочка</option>
        <option value="Мясо, рыба, охлажденка">Мясо, рыба, охлажденка</option>
        <option value="Кулинария">Кулинария</option>
        <option value="Овощи и Фрукты">Овощи и Фрукты</option>
        <option value="Другое">Другое</option>
    </select>
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

        // перенумерация номера камеры
        let elem = cashRegs[i].querySelector('[name^="camera_number_"]')
        changeNameNumber(elem, i)

        // перенумерация производителя
        elem = cashRegs[i].querySelector('[name^="manufacturer_"]')
        changeNameNumber(elem, i)

        // перенумерация куда смотрит
        elem = cashRegs[i].querySelector('[name^="watch_for_"]')
        if (elem) changeNameNumber(elem, i)


        // перенумерация куда смотрит ручной ввод
        elem = cashRegs[i].querySelector('[name^="another_watch_for_"]')
        if (elem) changeNameNumber(elem, i)


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
    let fridge_name = e.target.closest('[name^="watch_for_"]')

    // клик для появления/удаление дополнительного поля названия холодильника
    if (fridge_name && fridge_name.value == 'Другое') {
        let nameElements = fridge_name.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherModel = document.querySelector(`[name^="another_watch_for_${number}"]`)
        if (!anotherModel) {
            const newAnotherModel = document.createElement('div')
            newAnotherModel.classList.add('login-field')
            newAnotherModel.innerHTML = `<p class="field-title">Введите зону *</p>
        <input class="field" type="text" name="another_watch_for_${number}" required/>`
        fridge_name.parentNode.insertBefore(newAnotherModel, fridge_name.nextSibling)
        }
    } else if (fridge_name && fridge_name.value != 'Другая модель') {
        let nameElements = fridge_name.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherModel = document.querySelector(`[name^="another_watch_for_${number}"]`)
        if (anotherModel) {
            const fieldForDel = anotherModel.closest('.login-field')
            if (anotherModel) fieldForDel.remove()
        }
    }
}


forms.addEventListener('change', e => formsChanges(e) )
forms.addEventListener('click', e => formsClicks(e) )