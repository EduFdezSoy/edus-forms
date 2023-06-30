import PocketBase from "./pocketbase.es.mjs";
import config from "./config.js";
import constants from "./constants.js";

const pb = new PocketBase(config.base_url);

init();

async function init() {
    // if data in path load form
    // if data has editor flag opens editor for that form
    // TODO: check if the user has edit rights (add a config variable to check or not to check this)
    // else show editor generator

}