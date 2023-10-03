import DELETE from "./deleteDocument.services";
import GET from "./getDocument.services";
import SAVE from "./saveDocument.services";


export const SERVICES = {
    getters: GET,
    savers: SAVE,
    deleters: DELETE
}