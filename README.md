# 💼 LinkedIn AI Assistant

**LinkedIn AI Assistant** est une extension Chrome simple et efficace qui utilise l'intelligence artificielle pour générer automatiquement des réponses professionnelles aux messages reçus sur LinkedIn.

---

## 🚀 Fonctionnalités

- 🧠 Génération automatique de réponses basées sur le dernier message reçu.
- 💬 Détection automatique de la langue (français ou anglais).
- ✨ Réponses courtes, professionnelles et personnalisées.
- 👤 Extraction automatique du prénom du contact et du nom d’utilisateur.
- 🔘 Bouton "AI Reply" intégré directement dans l’interface de messagerie LinkedIn.

---

## 🔒 Sécurité

⚠️ **Clé API non incluse dans le code source.**  
Utilise un fichier `.env` ou une autre méthode sécurisée pour gérer ta clé API avant de publier.

---

## 📦 Installation manuelle

1. Clone ce dépôt :

```bash
git clone https://github.com/ton-utilisateur/linkedin-ai-assistant.git
```

2. Ouvre Chrome et accède à `chrome://extensions`

3. Active le **Mode développeur** (coin supérieur droit).

4. Clique sur **Charger l’extension non empaquetée** et sélectionne le dossier du projet.

5. L’extension est maintenant active sur LinkedIn.

---

## 🧪 Utilisation

1. Ouvre une conversation LinkedIn.
2. Clique sur le bouton **AI Reply** dans la barre d’envoi.
3. Une réponse générée automatiquement s'affiche dans la zone de texte.
4. Relis, ajuste si besoin, et envoie !

---

## ⚙️ Configuration

Le modèle utilisé est par défaut `openai/gpt-3.5-turbo` via l’API OpenRouter.

Tu dois ajouter ta propre clé API dans le script avant de l’utiliser :

```js
const OPENROUTER_API_KEY = "ta_clé_api";
```


---

## 📄 Licence

Ce projet est sous licence **MIT**.  
Tu peux l’utiliser, le modifier, et le partager librement.
