import PocketBase from "./pocketbase.es.mjs";
import config from "./config.js";
import constants from "./constants.js";

const pb = new PocketBase(config.base_url);

var formInputCount = 0;
var form = null;

init();
mainLoop();

/**
 * Initialization function, starts the program
 */
async function init() {
  const pathVar = window.location.pathname;

  // no form = show form generator
  if (pathVar == "" || pathVar == "/") {
    // TODO: check user permissions
    const createDialog = document.getElementById("create-form-dg");
    createDialog.setAttribute("open", "");
    createDialog.querySelector("button").addEventListener("click", async () => {
      const form_name = createDialog.querySelector("input").value;

      if (form_name == "") {
        setError(
          "please, set a name to create a new form",
          "No name set!",
          true
        );
      } else {
        const res = await pb.collection(config.collection_name).create({
          name: createDialog.querySelector("input").value,
        });
        window.location.pathname = `/${res.id}-edit`;
      }
    });

    // if data in path
  } else {
    const formID = pathVar.split("-")[0].replace(/^\/+/, "");

    // get data from server
    try {
      form = await pb.collection(config.collection_name).getOne(formID);
    } catch (error) {
      setError(404, "This form was not found");
    }

    // show the form
    console.log(form);

    // TODO: add a loop till null div example: element-01
    const element = document.getElementById("element-01");
    formInputCount++;

    // if edit flag, open editor
    if (pathVar.split("-")[1] == "edit") {
      // TODO: check if the user has edit rights (add a config variable to check or not to check this)
      console.log("editor!");
      setEditor(element);

      // set add input form button event
      const addInputBtn = document.getElementById("add-form-entry");
      addInputBtn.style.display = "block";
      addInputBtn.addEventListener("click", () => {
        addNewInput();
      });
    }
  }
}

/**
 * main loop, currently just eating memory
 */
function mainLoop() {
  setTimeout(() => {}, constants.LOOP_TIME);
}

/**
 * sets the editor to the required element
 *
 * @param {HTMLElement} element the HTMLElement to atach the editor
 */
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
  const labelInput = editor.querySelector("[name=label]");
  const labelPositionInput = editor.querySelector("[name=label-position]");
  const nameInput = editor.querySelector("[name=name]");
  const placeholderInput = editor.querySelector("[name=placeholder]");
  const typeInput = editor.querySelector("[name=type]");
  const valueInput = editor.querySelector("[name=value]");

  // populate type list
  constants.inputTypeList.forEach((type) => {
    const el = document.createElement("option");
    el.textContent = type;
    el.value = type;

    if (type == input.type) el.setAttribute("selected", "selected");

    typeInput.appendChild(el);
  });

  // put values to inputs
  labelInput.value = label.textContent;
  nameInput.value = input.getAttribute("name");
  placeholderInput.value = input.getAttribute("placeholder");
  valueInput.value = input.getAttribute("value");

  // set input listeners
  labelInput.addEventListener("input", (e) => {
    label.textContent = e.target.value;
  });
  setInputListener(nameInput, input, "name");
  setInputListener(placeholderInput, input, "placeholder");
  setInputListener(typeInput, input, "type");
  setInputListener(valueInput, input, "value");
  // label position selector
  labelPositionInput.addEventListener("input", (e) => {
    switch (e.target.value) {
      case "top":
        label.style.display = "inline";
        if (!(label.nextElementSibling instanceof HTMLBRElement))
          label.nextElementSibling.parentNode.insertBefore(
            document.createElement("br"),
            label.nextElementSibling
          );
        break;
      case "side":
        label.style.display = "inline";
        if (label.nextElementSibling instanceof HTMLBRElement)
          label.nextElementSibling.remove();
        break;
      case "hide":
        label.style.display = "none";
        if (label.nextElementSibling instanceof HTMLBRElement)
          label.nextElementSibling.remove();
        break;
    }
  });

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

      element.parentNode.insertBefore(element, element.previousElementSibling);
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

/**
 * Creates a new input element inside the form
 */
function addNewInput() {
  const formContainer = document.getElementById("form");
  const element = document.createElement("input");

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
  label.setAttribute("for", `${tagName}-input`);
  div.appendChild(label);

  // set input tag
  input.setAttribute("id", `${tagName}-input`);
  div.appendChild(input);

  return div;
}

/**
 * set an input event to {input} element and, on event,
 * puts an attribute {attribute} to {output} element
 *
 * @param {HTMLElement} input element to put the listener to
 * @param {HTMLElement} output element to add the value on event
 * @param {String} attribute attribute to put the value to
 */
function setInputListener(input, output, attribute) {
  input.addEventListener("input", (e) => {
    output.setAttribute(attribute, e.target.value);
  });
}

/**
 * puts an error dialog on the screen
 *
 * @param {Number | String | null} errCode example: 404
 * @param {String} errMessage example: not found
 * @param {Boolean} close show or not a close button
 */
function setError(errCode, errMessage, close = false) {
  const errDialog = document.getElementById("error-dg");

  // put error
  errDialog.querySelector("span").textContent = errCode;
  errDialog.querySelector("h2").textContent = errMessage;

  // hide button
  if (!close) {
    errDialog.querySelector("button").style.display = "none";
  }

  // set visible
  errDialog.setAttribute("open", "");
}
