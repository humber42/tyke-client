export const JWT_SECRET_KEY = "QsbjabKbkbKjsdays89sdskdnasnSSUasndasndP";

//Users URLS
export const URL_LOGIN = "http://192.168.137.1:9092/login-service/api/login";
export const URL_GET_USER_BY_USERNAME ="http://192.168.137.1:9092/user-service/api/user/fetch-user/";
export const URL_UPDATE_USER ="http://192.168.137.1:9092/user-service/api/user/update";
export const URL_CHANGE_PASSWORD="http://192.168.137.1:9092/user-service/api/user/change-password";
export const URL_REGISTER_USER ="http://192.168.137.1:9092/user-service/api/user/register";
export const URL_FETCH_ALL_USERS ="http://192.168.137.1:9092/user-service/api/user/fetch-all-users";
export const URL_FETCH_ALL_ROLES= "http://192.168.137.1:9092/user-service/api/role/get-rols";
export const URL_SAVE_USER="http://192.168.137.1:9092/user-service/api/user/save";
export const URL_DELETE_USER ="http://192.168.137.1:9092/user-service/api/user/delete-user";
export const URL_SAVE_ROL="http://192.168.137.1:9092/user-service/api/role/save";
export const URL_DELETE_ROL="http://192.168.137.1:9092/user-service/api/role/delete/";
export const URL_GET_USERS_PROFESORS="http://192.168.137.1:9092/user-service/api/user/get-professors";

//Scholar-Management-Service
export const URL_FETCH_ALL_ASIGNATURAS = "http://192.168.137.1:9092/schoolar-management-service/api/asignatura";
export const URL_SAVE_ASIGNATURA = "http://192.168.137.1:9092/schoolar-management-service/api/asignatura/save";
export const URL_UPDATE_ASiGNATURA= "http://192.168.137.1:9092/schoolar-management-service/api/asignatura/update";

export const URL_GET_ALL_FACULTIES="http://192.168.137.1:9092/schoolar-management-service/api/facultad";
export const URL_GET_FACULTY_BY_NAME="http://192.168.137.1:9092/schoolar-management-service/api/facultad/name"
export const URL_SAVE_FACULTY ="http://192.168.137.1:9092/schoolar-management-service/api/facultad/save";
export const URL_UPDATE_FACULTY="http://192.168.137.1:9092/schoolar-management-service/api/facultad/update";
export const URL_DELETE_FACULTY="http://192.168.137.1:9092/schoolar-management-service/api/facultad/delete/id";

export const URL_GET_ALL_CAREERS="http://192.168.137.1:9092/schoolar-management-service/api/carrera";
export const URL_SAVE_CAREER="http://192.168.137.1:9092/schoolar-management-service/api/carrera/save";
export const URL_DELETE_CAREER="http://192.168.137.1:9092/schoolar-management-service/api/carrera/delete/id";
export const URL_UPDATE_CAREER="http://192.168.137.1:9092/schoolar-management-service/api/carrera/update";

export const URL_FETCH_ALL_TEMAS="http://192.168.137.1:9092/schoolar-management-service/api/tema";
export const URL_SAVE_TEMA="http://192.168.137.1:9092/schoolar-management-service/api/tema/save";
export const URL_DELETE_TEMA="http://192.168.137.1:9092/schoolar-management-service/api/tema/delete/id"
export const URL_UPDATE_TEMA="http://192.168.137.1:9092/schoolar-management-service/api/tema/update";

export const URL_FETCH_ALL_COURSES ="http://192.168.137.1:9092/schoolar-management-service/api/curso";
export const URL_DELETE_COURSE_BY_ID = "http://192.168.137.1:9092/schoolar-management-service/api/curso/delete/id";
export const URL_DELETE_COURSE_BY_NAME="http://192.168.137.1:9092/schoolar-management-service/api/curso/delete/name";
export const URL_GET_COURSE_BY_ID="http://192.168.137.1:9092/schoolar-management-service/api/curso/id";
export const URL_GET_COURSE_BY_NAME="http://192.168.137.1:9092/schoolar-management-service/api/curso/name";
export const URL_SAVE_COURSE="http://192.168.137.1:9092/schoolar-management-service/api/curso/save";
export const URL_UPDATE_COURSE="http://192.168.137.1:9092/schoolar-management-service/api/curso/update";

export const URL_FETCH_ALL_GROUPS ="http://192.168.137.1:9092/schoolar-management-service/api/grupo";
export const URL_SAVE_GRUPO="http://192.168.137.1:9092/schoolar-management-service/api/grupo/save";
export const URL_DELETE_GRUPO_BY_ID="http://192.168.137.1:9092/schoolar-management-service/api/grupo/id"

export const URL_GET_ALL_STUDENTS_BY_FACULTY="http://192.168.137.1:9092/schoolar-management-service/api/estudiante/name-faculty";
export const URL_GET_SEMESTERS="http://192.168.137.1:9092/schoolar-management-service/api/semestre";

export const URL_ASSIGN_SIGNATURES_TO_CAREERS = "http://192.168.137.1:9092/schoolar-management-service/api/signature-career/save";

export const URL_FETCH_ALL_PROFESSORS="http://192.168.137.1:9092/schoolar-management-service/api/profesor";
export const URL_SAVE_PROFESOR="http://192.168.137.1:9092/schoolar-management-service/api/profesor/save";
export const URL_DELETE_PROFESOR="http://192.168.137.1:9092/schoolar-management-service/api/profesor/delete/id";
export const URL_UPDATE_PROFESOR="http://192.168.137.1:9092/schoolar-management-service/api/profesor/update";
export const URL_GET_CAREERS_BY_FACULTY_NAME="http://192.168.137.1:9092/schoolar-management-service/api/carrera/all/facultad";
export const URL_FETCH_GET_SIGNATURES_BY_CAREER_NAME="http://192.168.137.1:9092/schoolar-management-service/api/asignatura/all/careers";
export const URL_GET_GRUPOS_BY_CAREER="http://192.168.137.1:9092/schoolar-management-service/api/grupo/all/carrera";
export const URL_TO_ASSIGN_PROFESORS_TO_SIGNATURES="http://192.168.137.1:9092/schoolar-management-service/api/asignatura-profesor-grupo/list/save";
export const URL_POST_IMAGE="http://192.168.137.1:9092/schoolar-management-service/uploadFile";

//Question Service
export const URL_FETCH_ALL_TIPO_PREGUNTA="http://192.168.137.1:9092/question-service/api/tipo-pregunta";
export const URL_SAVE_TIPO_PREGUNTA="http://192.168.137.1:9092/question-service/api/tipo-pregunta/save"
export const URL_DELETE_TIPO_PREGUNTA="http://192.168.137.1:9092/question-service/api/tipo-pregunta/delete/id";

export const URL_FETCH_ALL_TIPO_PISTA="http://192.168.137.1:9092/question-service/api/tipo-pista";
export const URL_SAVE_TIPO_PISTA="http://192.168.137.1:9092/question-service/api/tipo-pista/save";
export const URL_DELETE_TIPO_PISTA="http://192.168.137.1:9092/question-service/api/tipo-pista/delete/id";
export const URL_EDIT_TIPO_PISTA="http://192.168.137.1:9092/question-service/api/tipo-pista/update";

export const URL_FETCH_ALL_QUESTIONS="http://192.168.137.1:9092/question-service/api/pregunta";
export const URL_SAVE_QUESTION="http://192.168.137.1:9092/question-service/api/pregunta/save/complete";
export const URL_DELETE_QUESTION="http://192.168.137.1:9092/question-service/api/pregunta/delete/id";


//Strategy Service
export const URL_FETCH_ALL_TIPO_REGALO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/tipo-regalo/all";
export const URL_SAVE_TIPO_REGALO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/tipo-regalo/save";
export const URL_DELETE_TIPO_REGALO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/tipo-regalo/delete/id";

export const URL_FETCH_ALL_OTORGAMIENTO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/otorgamiento/all";
export const URL_SAVE_OTORGAMIENTO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/otorgamiento/save";
export const URL_DELETE_OTORGAMIENTO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/otorgamiento/delete/id";
export const URL_EDIT_OTORGAMIENTO="http://192.168.137.1:9092/tyke-strategy-service/api/v1/otorgamiento/update";

export const URL_FETCH_ALL_GIFTS="http://192.168.137.1:9092/tyke-strategy-service/api/v1/regalo/all";
export const URL_SAVE_GIFT="http://192.168.137.1:9092/tyke-strategy-service/api/v1/regalo/save";
export const URL_DELETE_GIFT="http://192.168.137.1:9092/tyke-strategy-service/api/v1/regalo/delete/id";
export const URL_EDIT_GIFT="http://192.168.137.1:9092/tyke-strategy-service/api/v1/regalo/update";

export const URL_FETCH_ALL_ROL_PROFESIONAL="http://192.168.137.1:9092/tyke-strategy-service/api/v1/rol-profesional/all";
export const URL_SAVE_ROL_PROFESIONAL="http://192.168.137.1:9092/tyke-strategy-service/api/v1/rol-profesional/save";
export const URL_DELETE_ROL_PROFESIONAL="http://192.168.137.1:9092/tyke-strategy-service/api/v1/rol-profesional/delete/id";

export const URL_FETCH_ALL_INSIGNIA="http://192.168.137.1:9092/tyke-strategy-service/api/v1/insignia/all";
export const URL_SAVE_INSIGNIA="http://192.168.137.1:9092/tyke-strategy-service/api/v1/insignia/save";
export const URL_DELETE_INSIGNIA="http://192.168.137.1:9092/tyke-strategy-service/api/v1/insignia/delete/id";
export const URL_EDIT_INSIGNIA="http://192.168.137.1:9092/tyke-strategy-service/api/v1/insignia/update";

export const URL_FETCH_ALL_STRATEGY="http://192.168.137.1:9092/tyke-strategy-service/api/v1/estrategia/all";
export const URL_ESTRATEGIA_SAVE="http://192.168.137.1:9092/tyke-strategy-service/api/v1/estrategia/save/all";
export const URL_ESTRATEGIA_DELETE="http://192.168.137.1:9092/tyke-strategy-service/api/v1/estrategia/delete/id";

/**
 * URLS PARA CONFORMAR LA ESTRATEGIA
 */
export const URL_GET_PROFESOR_BY_USER_ID="http://192.168.137.1:9092/schoolar-management-service/api/profesor/user/id";
export const URL_GET_TEMA_BY_ASIGNATURA_ID="http://192.168.137.1:9092/schoolar-management-service/api/tema/asignatura";
export const URL_GET_GROUPS_BY_PROFESOR_AND_ASIGNATURA="http://192.168.137.1:9092/schoolar-management-service/api/grupo/all/asignatura-profesor";
export const URL_GET_PREGUNTAS_BY_ASIGNATURA="http://192.168.137.1:9092/question-service/api/pregunta/all/signature";

export const URL_GET_ALL_RANKING="http://192.168.137.1:9092/tyke-strategy-service/api/v1/puntuacion/all";
export const URL_POST_USER_IMG="http://192.168.137.1:9092/user-service/uploadFile";