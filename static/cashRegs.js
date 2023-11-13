const wrapper = document.querySelector('.wrapper');
wrapper.style.height = 'auto'

const forms = document.querySelector('.cash-regs-froms')
const cashRegType = document.querySelector('.cash_reg_type')
//счётчик количества касс
let countCashRegs = 0


//содержимое новой кассы КСО/КСК
const createNewCashReg = (number) => {

    const cashRegWrapper = document.createElement('div');
    cashRegWrapper.classList.add('cash_regs_wrapper_' + number);
    cashRegWrapper.classList.add('style_cash_regs_wrapper');
    cashRegWrapper.innerHTML = `<div class="login-field">
    <p class="field-title">Номер кассы (Цифры) *</p>
    <input class="field" type="number" name="cash_reg_number_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Конфигурация кассы *</p>
    <select class="field cash_reg_type" name="cash_reg_config_${number}" required>
        <option></option>
        <option value="Моноблок">Моноблок</option>
        <option value="Системник">Системник</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">ПО *</p>
    <select class="field cash_reg_type" name="cash_reg_po_${number}" required>
        <option></option>
        <option value="Фронтол">Фронтол</option>
        <option value="Тилси">Тилси</option>
    </select>
</div>
<div class="login-field">
        <p class="field-title">ФР *</p>
        <select class="field" name="shop_fr_${number}" required>
            <option></option>
            <option value="Да">Да</option>
            <option value="Нет">Нет</option>
        </select>
    </div>
    <div class="login-field">
        <p class="field-title">Эквайринг *</p>
        <select class="field" name="shop_ecv_${number}" required>
            <option></option>
            <option value="Да">Да</option>
            <option value="Нет">Нет</option>
        </select>
    </div>
<div class="login-field">
    <p class="field-title">Модель весов БЛЯЯЯ *</p>
    <select class="field cash_reg_type" name="scale_model_${number}" required>
        <option></option>
        <option value="Весы M-ER 221F">Весы M-ER 221F</option>
        <option value="Весы штрих слим">Весы штрих слим</option>
        <option value="Другая модель">Другая модель</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">Версия платформы Атол *</p>
    <select class="field cash_reg_type" name="atol_v_${number}" required >
        <option></option>
        <option value="Платформа 5">Платформа 5</option>
        <option value="Платформа 2.5">Платформа 2.5</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">ID ТИМВИВЕР *</p>
    <input class="field" type="text" name="teamviewer_id_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Пароль *</p>
    <select class="field cash_reg_type" name="cash_reg_pass_${number}" required>
        <option></option>
        <option value="Стандартный (Asdqaz)">Стандартный (Asdqaz)</option>
        <option value="Другой">Другой</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">Примечание</p>
    <textarea class="field" name="cash_reg_not_${number}" cols="30" rows="10" style="resize: none;"></textarea>
</div>
<div class="add_or_del_cash_reg">
    <p class="add_cash_reg_${number}">Добавить кассу</p>
    <p class="del_cash_reg_${number} hide-button">Удалить кассу</p>
</div>`

    return cashRegWrapper;

}

//содержимое новой кассы ВСО
const createNewCashRegVSO = (number) => {

    const cashRegWrapper = document.createElement('div');
    cashRegWrapper.classList.add('cash_regs_wrapper_' + number);
    cashRegWrapper.classList.add('style_cash_regs_wrapper');
    cashRegWrapper.innerHTML = `<div class="login-field">
    <p class="field-title">Номер кассы (Цифры) *</p>
    <input class="field" type="number" name="cash_reg_number_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Конфигурация кассы *</p>
    <select class="field cash_reg_type" name="cash_reg_config_${number}" required>
        <option></option>
        <option value="Моноблок">Моноблок</option>
        <option value="Системник">Системник</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">ПО *</p>
    <select class="field cash_reg_type" name="cash_reg_po_${number}" required>
        <option></option>
        <option value="Фронтол">Фронтол</option>
        <option value="Тилси">Тилси</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">Модель весов *</p>
    <select class="field cash_reg_type" name="scale_model_${number}" required>
        <option></option>
        <option value="Весы M-ER 221F">Весы M-ER 221F</option>
        <option value="Весы штрих слим">Весы штрих слим</option>
        <option value="Другая модель">Другая модель</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">ID ТИМВИВЕР *</p>
    <input class="field" type="text" name="teamviewer_id_${number}" required/>
</div>
<div class="login-field">
    <p class="field-title">Пароль *</p>
    <select class="field cash_reg_type" name="cash_reg_pass_${number}" required>
        <option></option>
        <option value="Стандартный (Asdqaz)">Стандартный (Asdqaz)</option>
        <option value="Другой">Другой</option>
    </select>
</div>
<div class="login-field">
    <p class="field-title">Примечание</p>
    <textarea class="field" name="cash_reg_not_${number}" cols="30" rows="10" style="resize: none;"></textarea>
</div>
<div class="add_or_del_cash_reg">
    <p class="add_cash_reg_${number}">Добавить кассу</p>
    <p class="del_cash_reg_${number} hide-button">Удалить кассу</p>
</div>`

    return cashRegWrapper;

}

// выбор типа кассы
let cashRegTypeValue = ''
cashRegType.addEventListener('change', e => {
    if (cashRegType.value != '') {
        forms.innerHTML = ''
        countCashRegs = 1
    }
    if (cashRegType.value == 'КСО' || cashRegType.value == 'КСК') {
        forms.innerHTML = ''
        countCashRegs = 1
        forms.appendChild(createNewCashReg(1))
    } else if (cashRegType.value == 'ВСО') {
        forms.innerHTML = ''
        countCashRegs = 1
        createNewCashRegVSO(1)
        forms.appendChild(createNewCashRegVSO(1))
    }
    cashRegTypeValue = cashRegType.value
})

// добавление кассы
const addCashReg = () => {
    ++countCashRegs
    if (cashRegType.value == 'КСО' || cashRegType.value == 'КСК') {
        forms.appendChild(createNewCashReg(countCashRegs))
    } else if (cashRegTypeValue == 'ВСО') {
        forms.appendChild(createNewCashRegVSO(countCashRegs))
    }
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

        // перенумерация номера кассы
        let elem = cashRegs[i].querySelector('[name^="cash_reg_number_"]')
        changeNameNumber(elem, i)

        // перенумерация конфигурации кассы
        elem = cashRegs[i].querySelector('[name^="cash_reg_config_"]')
        changeNameNumber(elem, i)
        
        
        // перенумерация по
        elem = cashRegs[i].querySelector('[name^="cash_reg_po_"]')
        changeNameNumber(elem, i)

        // перенумерация фр
        elem = cashRegs[i].querySelector('[name^="shop_fr_"]')
        changeNameNumber(elem, i)

        // перенумерация эквайринг
        elem = cashRegs[i].querySelector('[name^="shop_ecv_"]')
        changeNameNumber(elem, i)

        // перенумерация модели весов
        elem = cashRegs[i].querySelector('[name^="scale_model_"]')
        changeNameNumber(elem, i)

        // перенумерация другой модели весов
        elem = cashRegs[i].querySelector('[name^="scale_another_model_"]')
        if (elem) changeNameNumber(elem, i)


        // перенумерация версии атол
        elem = cashRegs[i].querySelector('[name^="atol_v_"]')
        if(elem) changeNameNumber(elem, i)


        // перенумерация ID тимвивер
        elem = cashRegs[i].querySelector('[name^="teamviewer_id_"]')
        changeNameNumber(elem, i)

        // перенумерация пароля
        elem = cashRegs[i].querySelector('[name^="cash_reg_pass_"]')
        changeNameNumber(elem, i)

        // перенумерация другого пароля
        elem = cashRegs[i].querySelector('[name^="cash_another_reg_pass_"]')
        if (elem) changeNameNumber(elem, i)

        // перенумерация примечания
        elem = cashRegs[i].querySelector('[name^="cash_reg_not_"]')
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

// ловим клики на кнопки добавления и удаления касс

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
    let scaleModel = e.target.closest('[name^="scale_model_"]')
    let pass = e.target.closest('[name^="cash_reg_pass_"]')

    // клик для появления/удаление дополнительного поля модели весов
    if (scaleModel && scaleModel.value == 'Другая модель') {
        let nameElements = scaleModel.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherModel = document.querySelector(`[name^="scale_another_model_${number}"]`)
        if (!anotherModel) {
            const newAnotherModel = document.createElement('div')
            newAnotherModel.classList.add('login-field')
            newAnotherModel.innerHTML = `<p class="field-title">Модель весов *</p>
        <input class="field" type="text" name="scale_another_model_${number}" required/>`
            scaleModel.parentNode.insertBefore(newAnotherModel, scaleModel.nextSibling)
        }
    } else if (scaleModel && scaleModel.value != 'Другая модель') {
        let nameElements = scaleModel.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherModel = document.querySelector(`[name^="scale_another_model_${number}"]`)
        if (anotherModel) {
            const fieldForDel = anotherModel.closest('.login-field')
            if (anotherModel) fieldForDel.remove()
        }
    }

    // клик для появления/удаление дополнительного поля пароля
    if (pass && pass.value == 'Другой') {
        let nameElements = pass.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherPass = document.querySelector(`[name^="cash_another_reg_pass_${number}"]`)
        if (!anotherPass) {
            const newAnotherPass = document.createElement('div')
            newAnotherPass.classList.add('login-field')
            newAnotherPass.innerHTML = `<p class="field-title">Введите пароль *</p>
            <input class="field" type="text" name="cash_another_reg_pass_${number}" required/>`
        pass.parentNode.insertBefore(newAnotherPass, pass.nextSibling)
        }
    } else if (pass && pass.value != 'Другой') {
        let nameElements = pass.getAttribute('name').split('_')
        let number = nameElements[nameElements.length - 1]
        const anotherPass = document.querySelector(`[name^="cash_another_reg_pass_${number}"]`)
        if (anotherPass) {
            const fieldForDel = anotherPass.closest('.login-field')
            if (anotherPass) fieldForDel.remove()
        }
    }
}

forms.addEventListener('change', e => formsChanges(e) )
forms.addEventListener('click', e => formsClicks(e) )