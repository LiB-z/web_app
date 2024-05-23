const TG = window.Telegram.WebApp;
const FORMS = document.querySelectorAll("form");
const FORMLIST = [...FORMS];
const NEXTBUTTONS = document.querySelectorAll('.btn_next');
const PREVBUTTONS = document.querySelectorAll('.btn_undo');
const RESETBUTTONS = document.querySelectorAll('.btn_reset');
const INPUTFIELDS = document.querySelectorAll('input[type=text]');
const RADIOSELECTS = document.querySelectorAll('input[type=radio]');
const SELECTFIELDS = document.querySelectorAll('select');
const TEXTFIELDS = document.querySelectorAll('textarea');
import claimReason from '../data/claimReason.json' with {type: 'json'};


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

// Listener's
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
        if([...PREVBUTTONS].includes(e.target)) {
            OpenPrevForm(e.target);
        }
        if([...RESETBUTTONS].includes(e.target)) {
            showPopup("ВНИМАНИЕ","Все заполненные даннные будут удалены. Вы уверены?", [{"type":"ok","text":"Завершить"},{"type":"close","text":"Отмена"}], (e)=> {
            })
            TG.close();
        }
    };
}
