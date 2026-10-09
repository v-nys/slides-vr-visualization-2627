## Prerequisites

- je hebt de [basissetup voor Godot XR uitgeprobeerd](https://docs.godotengine.org/en/stable/tutorials/xr/setting_up_xr.html)
- je hebt de startcode voor beweging in de Dungeon Crawler in C♯ (zie DigitAP)

---

## Reference spaces

- local
- stage
- local floor

note:

- we hebben een referentiepunt nodig voor onze XR-elementen
  - we moeten aspecten van de echte wereld (handpositie, ogen als camera,...) vertalen naar locatie in de gamewereld
  - XOrigin3D bepaalt waar het referentiepunt voor die zaken ligt
- opdracht: test de verschillende settings door de locatie van elementen in de wereld te printen
  - zie "reference point" in [GodotXR settings](https://docs.godotengine.org/en/stable/tutorials/xr/openxr_settings.html)

---

## Opdracht

- port deze video's naar het gegeven project:
  - [video 1](https://www.youtube.com/watch?v=v-jLvxlDSOY&authuser=0)
  - [video 2](https://www.youtube.com/watch?v=iz0tcT1cGBU&authuser=0)
- vermijd "transliteratie" van de code
  - breng de ideeën eerst in kaart
  - vertaal dan op basis daarvan
