Un projet personnel permettant de sélectionner facilement les images, pour (par exemple) un album photo grâce à une interface web.

## Installation
1. Cloner le dépôt de code
```
git clone --depth 1 https://github.com/lutrinos/PhotoSelect
```

2. Se déplacer dans le dossier du projet
```
cd PhotoSelect
```

3. Installer les dépendances ([Node.js](https://nodejs.org/fr) doit être intallé au préalable avec [npm](https://www.npmjs.com/), suivez [ce lien](https://nodejs.org/fr/download) pour les installer si ce n'est pas fait, c'est-à-dire si la commande suivante n'est pas reconnue)
```
npm install
```

4. Renommez le fichier `.local.env` en `.env`. Sur Linux, cela peut être fait avec
```
mv .local.env .env
```

5. Initialiser la base de données avec Prisma
```
npm run migrate
```

6. Construire l'application
```
npm run build
```

7. Servir l'application web
```
npm run start
```
Puis ouvrir le lien indiqué par la commande dans un navigateur, souvent ce sera http://localhost:3000

## Mise à jour
Pour mettre à jour l'application, vous pouvez faire la commande
```
git pull
```
Attention ! Cela supprimera la base de donnée précédente, et vous devrez refaire la sélection !

## Fonctionnement
Une fois l'application web ouverte, il faut créer une sélection via le bouton "Créer une sélection".

Il conduit à un formulaire où il est demandé d'indiquer le nom de la sélection, ainsi que le chemin d'accès des images. Celui-ci doit être accessible directement depuis l'ordinateur où vous exécutez l'application !

Vous serez ensuite conduit à l'interface de sélection, qui est constitué des parties suivantes :
- l'en-tête (la barre supérieure) indiquant le titre de la sélection, le nombre d'images sélectionnées sur le nombre d'images au total et un bouton permettant de retourner à l'accueil.
- la barre latérale, où les images sélectionnées sont présentes, avec un ordre inversé (les dernières images sélectionnées se trouvent tout en haut)
- l'espace principal, avec l'image actuelle sur laquelle vous pouvez zoomer en cliquant, et en bas la liste des prochaines images qui seront visualisées. Cliquez sur les images de la liste pour les afficher.

> Note concernant l'ordre des images : elles sont dans l'ordre lexicographique de leur chemin d'accès composante à composante. Autrement dit, elles sont ordonnées de la même manière que dans un explorateur de fichier, sans distinction dossier / image. De plus, tous les fichiers n'étant par des images valides sont sautés (vidéos, pdf, documents...)

- le bas de page avec la barre d'action. À gauche ne numéro de l'image sur le nombre total d'images. Au milieu, les flèches permettent de naviguer vers la gauche ou la droite parmi les images (vous pouvez aussi le faire avec les flèches du clavier). Le bouton central permet de sélectionner ou de retirer l'image actuelle à la sélection. Les images sélectionnées sont encadrées par un bord vert, et l'image actuelle par un bord noir.

En bas à droite, le bouton "Télécharger" permet de télécharger à tout moment un dossier contenant toutes les images sélectionnées. Ce dossier est zippé (compressé) donc il faut au l'extraire pour y accéder une fois qu'il a été téléchargé.

Lorsque vous "éteignez" l'application, le progrès n'est pas perdu ! En la relançant vous retournerez là où vous vous étiez arrêté.

## Versions
- Version avec l'interface légèrement remaniée du 15 juillet 2025
- Version initiale du 14 juillet 2025