import PocketBase from "./pocketbase.es.mjs";
import config from "./config.js";
import constants from "./constants.js";

const pb = new PocketBase(config.base_url);

var formInputCount = 0;


init();
mainLoop();

async function init() {
    // if data in path load form
    // if data has editor flag opens editor for that form
    // TODO: check if the user has edit rights (add a config variable to check or not to check this)
    // else show editor generator

    // TODO: add a loop till null div example: element-01
    const element = document.getElementById("element-01");
    setEditor(element);

    formInputCount++;

    // set add input form button event
    document.getElementById("add-form-entry").addEventListener("click", () => {
        addNewInput();
    });
}

function mainLoop() {
    setTimeout(() => {

    }, constants.LOOP_TIME);
}

function setEditor(element) {
    const id = element.getAttribute("id");
    const input = element.querySelector("input");
    const label = element.querySelector("label");

    const editBtn = document.querySelector("[name=editButton]").cloneNode(true);
    const editor = document.querySelector("[name=editor]").cloneNode(true);

    // editor elements
    // buttons
    const upBtn = editor.querySelector("[name=upBtn]");
    const downBtn = editor.querySelector("[name=downBtn]");
    const saveBtn = editor.querySelector("[name=saveBtn]");
    const deleteBtn = editor.querySelector("[name=deleteBtn]");
    // inputs
    const labelInput = editor.querySelector("[name=label]")
    const nameInput = editor.querySelector("[name=name]");
    const placeholderInput = editor.querySelector("[name=placeholder]");
    const typeInput = editor.querySelector("[name=type]");

    // populate type list
    constants.inputTypeList.forEach(type => {
        const el = document.createElement("option");
        el.textContent = type;
        el.value = type;

        if (type == input.type)
            el.setAttribute("selected", "selected");

        typeInput.appendChild(el);
    });

    // put values to inputs
    labelInput.value = label.textContent;
    nameInput.value = input.getAttribute("name");
    placeholderInput.value = input.getAttribute("placeholder");

    // set input listeners
    labelInput.addEventListener("input", (e) => {
        label.textContent = e.target.value;
    });

    nameInput.addEventListener("input", (e) => {
        input.setAttribute("name", e.target.value);
    });

    placeholderInput.addEventListener("input", (e) => {
        input.setAttribute("placeholder", e.target.value);
    });

    typeInput.addEventListener("input", (e) => {
        input.setAttribute("type", e.target.value);
    })

    // set ids
    editBtn.setAttribute("id", `${id}-editbtn`);
    editor.setAttribute("id", `${id}-editor`);

    // set click listener
    editBtn.style.display = "inline";
    editBtn.addEventListener("click", () => {
        editor.style.display = "block";
    });

    // set editor buttons actions

    upBtn.addEventListener("click", () => {
        let pos = element.getAttribute("position");


        if (pos > 0) {
            element.setAttribute("position", --pos);

            element.parentNode.insertBefore(element, element.previousElementSibling)
            // TODO: save to database

        }
    });

    downBtn.addEventListener("click", () => {
        let pos = element.getAttribute("position");

        if (element.nextElementSibling) {
            element.setAttribute("position", ++pos);
            element.parentNode.insertBefore(element.nextElementSibling, element);
        }

        // TODO: save to database
    });

    saveBtn.addEventListener("click", () => {
        editor.style.display = "none";
        // TODO: save to database
    });

    deleteBtn.addEventListener("click", () => {
        element.remove();
        // TODO: save to database
    });

    // TODO: exceptions based on input type

    // append elements
    element.appendChild(editBtn);
    element.appendChild(editor);
}

function addNewInput() {
    const formContainer = document.getElementById("form");
    const element = document.createElement("input")

    const elementReady = prepareElement(element);

    formContainer.appendChild(elementReady);

    setEditor(elementReady);

    // TODO: save to database
}

/**
 * from an input element adds the ids, values and other html elements
 * 
 * @param {HTMLElement} input the input element to encapsulate
 * @returns {HTMLElement} the element tree formed and ready to be added to the DOM
 */
function prepareElement(input) {
    const tagName = `element-${(++formInputCount).toString().padStart(2, "0")}`;

    // setup continer
    const div = document.createElement("div");
    div.setAttribute("position", formInputCount);
    div.setAttribute("id", tagName);

    // add some space
    const br = document.createElement("br");
    div.appendChild(br);

    // set the label
    const label = document.createElement("label");
    label.textContent = "New Input";
    label.setAttribute('for', `${tagName}-input`)
    div.appendChild(label);

    // set input tag
    input.setAttribute("id", `${tagName}-input`)
    div.appendChild(input);

    return div;
}