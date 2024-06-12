Endpoint : 192.168.56.1:5000
expo go :
npx expo start
expo start --tunnel //Autoriser sur appareil distant qui a un pare feu ou reséaux nat 
lancer:   npm start
npm install express --save = express

multer:


Commande GIT:


git status = regarder tout les changement apporter 
git branch = ouvre toute les branches
git reset --hard HEAD = back au dernier commit existant

react:
npm install react-native-image-base64 pour convertir en b64
import { FileSystem } from 'expo-file-system'; 
import ImageToBase64 from 'react-native-image-base64'; 

problème:
Lors du scan et de l'envoie post du contrat Erreur lors de l'envoi de la photo: [SyntaxError: JSON Parse error: Unexpected character: <]

MongoDB:

Tools :Mongo Compass,MongoDBShell

Commande : 
-mongosh verifier connection et installation de mongo et acceder au terminal de mongo 
-show dbs 
-use "dbname"
-show collections
-db."dbname".insertOne({champ 1 : "Valeur1", champ2 ...})
db."nomcollection".find() = verification de l'envoie de données dans la collection
la methode find recuperer les 20 premier document taper it pour itérer les 20 prochain document
-help 
-exit

Dependance:
npm install jsonwebtoken
npm install dotenv  pour cacher la cles secrete dans la machine pour que si commit en ligne invisible
npm install sharp --save compresser les image car chaine de caractere trop longue pour mongo 

Problematique:
Format base 64 trop long et impossible de voir toute la chaine de caractere de l'image si on souhaite consulter l'image.