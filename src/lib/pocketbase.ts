import PocketBase from "pocketbase";

// const pb = new PocketBase("http://127.0.0.1:8090");
const pb = new PocketBase("http://192.168.1.3:8090/");
// const pb = new PocketBase("https://listmate-db.fly.dev/");

// pb.beforeSend = function (url, options) {
//     console.log("before send url : " + url)
//     console.log("before send options : " + JSON.stringify(options))
//     // Vérifier la connexion Internet avant d'envoyer la requête
//     if (!navigator.onLine) {
//         throw new Error('Internet Disconnected');
//     }
//     return { url, options };
// };

// pb.afterSend = function (response, data) {
//     console.log("after send")
//     // Gérer les erreurs de réponse ici
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return data;
// };

export default pb;
