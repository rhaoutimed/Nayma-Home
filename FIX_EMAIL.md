# 🔧 Configuration de l'API Brevo - Instructions

## ⚠️ PROBLÈME ACTUEL

L'API Key utilisée dans le code peut ne pas être valide ou activée. Voici comment la configurer correctement :

## 📋 ÉTAPES POUR CONFIGURER BREVO

### 1. Créer un compte Brevo (gratuit)

1. Allez sur [https://app.brevo.com/](https://app.brevo.com/)
2. Créez un compte gratuit (300 emails/jour gratuits)
3. Confirmez votre email

### 2. Obtenir votre API Key

1. Connectez-vous à Brevo
2. Allez dans **Settings** (⚙️ en haut à droite)
3. Cliquez sur **SMTP & API**
4. Cliquez sur **API Keys**
5. Cliquez sur **Generate a new API key**
6. Donnez-lui un nom : "Nayma Home Website"
7. **COPIEZ LA CLÉ** (vous ne pourrez plus la voir après)

### 3. Vérifier l'email expéditeur

1. Dans Brevo, allez dans **Senders**
2. Ajoutez `mohamedrhaouti@esac.ma` comme expéditeur
3. Vérifiez l'email (cliquez sur le lien reçu)

### 4. Remplacer l'API Key dans le code

Ouvrez le fichier `script.js` et trouvez la ligne (environ ligne 210) :

```javascript
const apiKey = 'xkeysib-97239e001@smtp-brevo.com-YD4v8A2BMyQLbI3k';
```

Remplacez par :

```javascript
const apiKey = 'VOTRE_NOUVELLE_API_KEY_ICI';
```

### 5. Tester l'envoi d'email

1. Ouvrez `index.html` dans votre navigateur
2. Ajoutez un produit au panier
3. Passez une commande test
4. Vérifiez votre email `mohamedrhaouti@esac.ma`

---

## 🔄 SOLUTION ALTERNATIVE : Utiliser Web3Forms (Plus simple)

Si Brevo ne fonctionne pas, utilisez Web3Forms (gratuit, sans configuration) :

### 1. Obtenir une clé Web3Forms

1. Allez sur [https://web3forms.com/](https://web3forms.com/)
2. Entrez votre email : `mohamedrhaouti@esac.ma`
3. Recevez votre Access Key par email

### 2. Modifier script.js

Remplacez la fonction `sendOrderEmail` par :

```javascript
async function sendOrderEmail(data) {
    const formData = new FormData();
    formData.append('access_key', 'VOTRE_WEB3FORMS_KEY');
    formData.append('subject', `🛒 Nouvelle commande - ${data.prenom} ${data.nom} - ${data.total} DH`);
    formData.append('from_name', 'Nayma Home Website');
    formData.append('email', 'mohamedrhaouti@esac.ma');
    formData.append('message', createEmailText(data));
    
    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
    
    return await response.json();
}
```

---

## 🔄 SOLUTION ALTERNATIVE 2 : EmailJS (Recommandé)

EmailJS est facile à configurer et fiable :

### 1. Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (200 emails/mois)
3. Confirmez votre email

### 2. Configurer EmailJS

1. Allez dans **Email Services** > **Add New Service**
2. Choisissez votre provider (Gmail, Outlook, etc.)
3. Connectez votre email `mohamedrhaouti@esac.ma`
4. Notez le **Service ID**

5. Allez dans **Email Templates** > **Create New Template**
6. Utilisez ce template :

```
Subject: 🛒 Nouvelle commande - {{prenom}} {{nom}} - {{total}} DH

Client: {{prenom}} {{nom}}
Téléphone: {{telephone}}
Email: {{email}}
Ville: {{ville}}
Adresse: {{adresse}}

Produits:
{{produits}}

Total: {{total}} DH
Paiement: À la livraison

Date: {{date}}
```

7. Notez le **Template ID**

8. Allez dans **Account** > **General**
9. Notez votre **Public Key**

### 3. Modifier script.js

Initialisez EmailJS au début du fichier :

```javascript
// Initialiser EmailJS
(function() {
    emailjs.init("VOTRE_PUBLIC_KEY");
})();
```

Remplacez la fonction `sendOrderEmail` par :

```javascript
async function sendOrderEmail(data) {
    const templateParams = {
        prenom: data.prenom,
        nom: data.nom,
        telephone: data.telephone,
        email: data.email || 'Non fourni',
        ville: data.ville,
        adresse: data.adresse,
        notes: data.notes || 'Aucune',
        produits: data.cart.map(item => 
            `${item.name} x${item.quantity} = ${item.price * item.quantity} DH`
        ).join('\n'),
        total: data.total,
        date: new Date().toLocaleString('fr-FR')
    };
    
    return emailjs.send('VOTRE_SERVICE_ID', 'VOTRE_TEMPLATE_ID', templateParams);
}
```

---

## 🎯 QUELLE SOLUTION CHOISIR ?

### ✅ **Web3Forms** (Le plus simple)
- ✔️ Configuration en 2 minutes
- ✔️ Aucune limite stricte
- ✔️ Pas de vérification d'expéditeur
- ❌ Emails basiques (texte uniquement)

### ✅ **EmailJS** (Recommandé)
- ✔️ Interface facile
- ✔️ Templates personnalisables
- ✔️ 200 emails/mois gratuits
- ✔️ Support HTML
- ❌ Nécessite une configuration initiale

### ✅ **Brevo** (Le plus professionnel)
- ✔️ 300 emails/jour gratuits
- ✔️ Emails HTML avancés
- ✔️ Statistiques détaillées
- ❌ Configuration plus complexe
- ❌ Vérification d'expéditeur requise

---

## 🚀 SOLUTION TEMPORAIRE (Sans email)

Si vous voulez lancer le site immédiatement sans configuration d'email, j'ai déjà mis en place le système WhatsApp qui fonctionne parfaitement :

1. Configurez juste votre numéro WhatsApp dans `script.js`
2. Les commandes seront envoyées directement sur WhatsApp
3. Vous recevrez toutes les informations formatées

---

**Besoin d'aide ? Suivez les étapes ci-dessus ou choisissez la solution WhatsApp pour commencer immédiatement !** ✨
