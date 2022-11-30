// url calls
var windowURL = window.location.href;
var envUrl = window.location.origin;
//var modelAndViewName = 'cstview-people-react-pu';
var appName = "peopleReactPU"; //appname is exposeName of Application Designer
var indexOfAppName = windowURL.indexOf("/app/" + appName);
var contextUrl = windowURL.slice(envUrl.length, indexOfAppName);
export var REACT_APP_TRIRIGA_URL = "";
if (process.env.NODE_ENV === "development") {
  REACT_APP_TRIRIGA_URL = "https://jllsa-dev.iwmsapp.com/tririga";
} else {
  REACT_APP_TRIRIGA_URL = "".concat(envUrl).concat(contextUrl);
}
console.log(REACT_APP_TRIRIGA_URL);
// export const REACT_APP_TRIRIGA_URL = "https://jllsa-dev.iwmsapp.com/tririga";
export const REACT_APP_TRIRIGA_API_URL = ""
  .concat(REACT_APP_TRIRIGA_URL)
  .concat("/p/webapi/rest/v2/peopleReactPU/-1/");
export const REACT_APP_TRIRIGA_FILE_LOC_URL = ""
  .concat(REACT_APP_TRIRIGA_URL)
  .concat("/getCompanyFile.jsp?fileLoc=");
export const REACT_APP_OPEN_IN_TRIRIGA = ""
  .concat(REACT_APP_TRIRIGA_URL)
  .concat("/WebProcess.srv?objectId=750000&actionId=750011&specId=");
export const REACT_APP_LOCAL_TRIRIGA_LOGIN_REDIRECT = ""
  .concat(REACT_APP_TRIRIGA_URL)
  .concat("/p/websignon?redirectUrl=http%3A%2F%2Flocalhost%3A3000");
export const REACT_APP_TRIRIGA_IMAGE_UPLOAD_URL = ""
  .concat(REACT_APP_TRIRIGA_URL)
  .concat("//p/fileupload/uploadimage");
export const REACT_APP_DOCUMENT_DOWNLOAD = ""
  .concat(REACT_APP_TRIRIGA_URL)
  .concat("/WebProcess.srv?objectId=410000&actionId=410014&documentID=");
// ds calls
export const DS_All_PEOPLE_DATA = "allPeopleRecordsPU"; // dsname
