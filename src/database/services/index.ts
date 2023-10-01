import DELETE from "./deleteDocument.services";
import GET from "./getDocument.services";
import SAVE from "./saveDocument.services";
import UPDATE from "./updateDocument.services";


export const SERVICES = {
    getters: GET,
    savers: SAVE,
    updaters: UPDATE,
    deleters: DELETE
}