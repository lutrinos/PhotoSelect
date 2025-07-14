Un projet personnel permettant de sélectionner facilement les images, pour (par exemple) un album photo grâce à une interface web.

## Installation
1. Cloner le dépôt de code
```
git clone --depth 1 https://github.com/lutrinos/PhotoSelect
```

2. Installer les dépendances
```
npm install
```

3. Renommez le fichier `.local.env` en `.env`. Sur Linux, cela peut être fait avec
```
mv .local.env .env
```

4. Initialiser la base de données avec Prisma
```
npm run migrate
```

5. Construire l'application
```
npm run build
```

6. Servir l'application web
```
npm run start
```
Puis ouvrir le lien indiqué par la commande dans un navigateur, souvent ce sera http://localhost:3000

## Fonctionnement
Une fois l'application web ouverte, il faut créer une sélection via le bouton "Créer une sélection".

Il conduit à un formulaire où il est demandé d'indiquer le nom de la sélection, ainsi que le chemin d'accès des images. Celui-ci doit être accessible directement depuis l'ordinateur où vous exécutez l'application !

Vous serez ensuite conduit à l'interface de sélection, qui est constitué des parties suivantes :
- l'en-tête (la barre supérieure) indiquant le titre de la sélection et le nombre d'images sélectionnées sur le nombre d'images au total
- la barre latérale, où les images sélectionnées sont présentes, avec un ordre inversé (les dernières images sélectionnées se trouvent tout en haut)
- l'espace principal, avec l'image actuelle sur laquelle vous pouvez zoomer en cliquant, et en bas la liste des prochaines images qui seront visualisées.
> Note concernant l'ordre des images : elles sont dans l'ordre lexicographique de leur chemin d'accès composante à composante. Autrement dit, elles sont ordonnées de la même manière que dans un explorateur de fichier, sans distinction dossier / image. De plus, tous les fichiers m'étant par des images valides sont sautés.
- le bas de page avec la barre d'action. À gauche ne numéro de l'image sur le nombre total d'images. AU milieu, les flèches permettent de naviguer vers la gauche ou la droite parmi les images. Le bouton central permet de sélectionner ou de retirer l'image actuelle à la sélection. Les images sélectionnées sont encadrées par un bord vers, et l'image actuelle par un bord noir.

En bas à droite, le bouton "Télécharger" permet de télécharger -à tout moment- un dossier contenant toutes les images sélectionnées (ordonnées dans le même ordre initial). Ce dossier est zippé (compressé) donc il faut au préalable l'extraire pour y accéder.

Lorsque vous "éteignez" l'application, le progrès n'est pas perdu ! En la relançant vous retournerez là où vous vous étiez arrêté.