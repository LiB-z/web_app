const WebApp = window.Telegram.WebApp;
const FORMS = document.querySelectorAll("form");
const FORMLIST = [...FORMS];
const PREVBUTTONS = document.querySelectorAll('.btn_undo');
const RESETBUTTONS = document.querySelectorAll('.btn_reset');
const SENDBTN = document.querySelector('.requestedSum_btn')
const INFOLINK = document.querySelector('.invoice_link')
import claimReason from '../../../data/claimReason.json' with {type: 'json'};

const TELEGRAM = {
    showPopup() {
        WebApp.showPopup({
            title  : "ВНИМАНИЕ",
            message: "Все заполненные даннные будут удалены.",
            buttons: [
                {id: 'close', type: 'cancel'},
                {id: 'ok', type: 'destructive', text: 'Прервать создание претензии'},
            ]
        }, function (buttonId) {
            if (buttonId === 'ok') {
                WebApp.close();
            }
        })
    }
}
function FillCheck(field) {
    let currForm = field.closest('form');
    let nextBtn = currForm.querySelector('.btn_next');
    if(field.value.length > 0 && field.type != 'select-one') {
        nextBtn.removeAttribute("disabled", "");
    } else if (field.type == 'select-one') {
        AddClaimReasonDescription(field, currForm)
        nextBtn.removeAttribute("disabled", "");
    } else {
        nextBtn.setAttribute("disabled", "");
    }
}
function SelectCheck(radioBtn) {
    let currForm = radioBtn.closest('form');
    let nextBtn = currForm.querySelector('.btn_next');

    // валидация: если для формы нет fieldset -> меняем кнопку.
    if(currForm.querySelectorAll('fieldset').length > 0) {
        radioBtn.closest('fieldset').classList.toggle('is-hidden');
        currForm.querySelector(`.${radioBtn.getAttribute('id')}`).classList.toggle('is-hidden');
    } else {
        nextBtn.removeAttribute("disabled", "");
    }
    //!если есть - проверка на заполнение других полей (создать отдельную функцию?)
}
function AddClaimReasonDescription(field, currForm) {
    let descriptionField = currForm.querySelector('.claims-object_description');
    console.log(claimReason[`${field.value}`])
    console.log(descriptionField, currForm)
    descriptionField.textContent = claimReason[`${field.value}`]
}
function OpenNextForm(currForm) {
    currForm.classList.toggle('is-hidden');
    FORMS[FORMLIST.indexOf(currForm) + 1].classList.toggle('is-hidden');
}
function OpenPrevForm(prevBtn){
    let currForm = prevBtn.closest('form');
    let nextBtn = currForm.querySelector('.btn_next');

    currForm.reset();
    if (currForm.classList.contains('tc-select_form')) {
        currForm.classList.toggle('is-hidden');
        nextBtn.setAttribute("disabled", "");

        let prevForm = FORMLIST[FORMLIST.indexOf(currForm)-1];

        prevForm.reset();
        prevForm.querySelector('.btn_next').setAttribute("disabled", "");
        prevForm.classList.remove('is-hidden');
    } else if (currForm.querySelectorAll('fieldset').length > 0) {
        let activeFieldset = currForm.querySelector('fieldset:not(.is-hidden)');
        let FieldsetList = currForm.querySelectorAll('fieldset');

        activeFieldset.classList.add('is-hidden');
        FieldsetList[0].classList.remove('is-hidden');
        nextBtn.setAttribute("disabled", "");
    } else {
        console.log('проверь условие fieldset')
    }
}
//------------------------------------------------------------
//
//------------------------------------------------------------
// Listener's
//-----------Некорректно отрабатывает на Safari---------------
for(let i = 0; i < FORMS.length; i++) {
    FORMS[i].onsubmit = e => {
        e.preventDefault()
        OpenNextForm(e.target);
    };
    FORMS[i].oninput = e => {
        if(e.target.type == 'radio') {
            SelectCheck(e.target)
        } else {
            FillCheck(e.target)
        }
    };
    FORMS[i].onclick = e => {
        if(e.target == SENDBTN) {
            WebApp.close();
        }
        if (e.target == INFOLINK) {
            WebApp.showAlert(`Если вы не знаете номер накладной заявки или заказа, то перейдите по ссылке https://www.dellin.ru/tracker/ и найдите номер через поиск по параметрам.`);
        }
        if([...PREVBUTTONS].includes(e.target)) {
            OpenPrevForm(e.target);
        }
        if([...RESETBUTTONS].includes(e.target)) {
            e.preventDefault();
            TELEGRAM.showPopup();
        }
    };
}
//------------------------------------------------------------
//
//------------------------------------------------------------
// for(let i = 0; i < FORMS.length; i++) {
//     FORMS[i].addEventListener('submit', ReactAtSubmit);
//     FORMS[i].addEventListener('input', ReactAtRadioBtn);
//     FORMS[i].addEventListener('click', ReactAtFormAction);
// }
// function ReactAtSubmit(e) {
//     e.preventDefault()
//     OpenNextForm(e.target);
// };
// function ReactAtFormAction(e) {
//     if(e.target == SENDBTN) {
//         //Добавить генерацию json
//         //Добавить Delay
//         WebApp.close();
//     }
//     if (e.target == INFOLINK) {
//         WebApp.showAlert(`Если вы не знаете номер накладной заявки или заказа, то перейдите по ссылке https://www.dellin.ru/tracker/ и найдите номер через поиск по параметрам.`);
//     }
//     if([...PREVBUTTONS].includes(e.target)) {
//         OpenPrevForm(e.target);
//     }
//     if([...RESETBUTTONS].includes(e.target)) {
//         e.preventDefault();
//         TELEGRAM.showPopup();
//     }
// };
// function ReactAtRadioBtn(e) {
//     if(e.target.type == 'radio') {
//         SelectCheck(e.target)
//     } else {
//         FillCheck(e.target)
//     }
// };