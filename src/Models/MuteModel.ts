import { Fields } from "quickmongo";

module.exports = new Fields.ObjectField({
    userID: new Fields.StringField(),
    duration: new Fields.StringField()
})