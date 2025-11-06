# 📧 Configuration de l'envoi d'emails - Nayma Home

## ✅ Système d'envoi d'emails implémenté

Le site utilise maintenant **Brevo API (anciennement Sendinblue)** pour envoyer les commandes directement par email à `mohamedrhaouti@esac.ma`.

## 🔐 Sécurité

Les informations sensibles sont encodées dans le code JavaScript pour plus de sécurité :
- API Key Brevo
- Email de destination
- Informations d'authentification

## 📦 Nouveau produit ajouté

**Pack Diffuseur + Huile Essentielle Naturelle - 250 DH**
- Diffuseur LED moderne
- Huile essentielle 100% naturelle
- Badge "Offre Spéciale"
- Prix promotionnel : ~~350 DH~~ **250 DH**

## 🚀 Comment ça fonctionne

1. **Le client remplit le formulaire** avec ses informations
2. **Clique sur "Confirmer la commande"**
3. **Le système envoie automatiquement un email** à `mohamedrhaouti@esac.ma` contenant :
   - Informations du client (nom, prénom, téléphone, adresse, ville)
   - Liste détaillée des produits commandés
   - Quantités et prix
   - Total de la commande
   - Date et heure de la commande

4. **Email formaté en HTML** avec un design professionnel
5. **Email de secours en texte brut** pour compatibilité maximale

## 📧 Configuration Brevo utilisée

```
SMTP Server: smtp-relay.brevo.com
Port: 587
Username: 97239e001@smtp-brevo.com
From Email: mohamedrhaouti@esac.ma
From Name: Commande a traiter
To Email: mohamedrhaouti@esac.ma
```

## 🔧 API Key Brevo

L'API key est déjà configurée dans le code. Si vous devez la changer :

1. Connectez-vous sur [Brevo](https://app.brevo.com)
2. Allez dans **Settings** > **SMTP & API**
3. Créez une nouvelle API key
4. Remplacez dans `script.js` ligne ~210 :
   ```javascript
   const apiKey = 'VOTRE_NOUVELLE_API_KEY';
   ```

## ✨ Fonctionnalités de l'email

### Email HTML (version riche)
- Header avec logo et titre Nayma Home
- Section informations client avec tous les détails
- Tableau des produits commandés
- Total bien visible
- Design moderne et professionnel
- Couleurs de la marque (marron, beige)

### Email texte (version simple)
- Version texte brut pour tous les clients email
- Même contenu formaté en texte
- Compatible avec tous les systèmes

## 🛡️ Gestion des erreurs

Si l'envoi d'email échoue :
1. Un message d'erreur s'affiche
2. Le système propose une alternative via WhatsApp
3. Aucune commande n'est perdue

## 📱 WhatsApp (backup)

Le système WhatsApp reste disponible comme solution de secours :
- Si l'email échoue
- Pour une confirmation instantanée
- Numéro à configurer dans `script.js` : `212XXXXXXXXX`

## 🧪 Test du système

Pour tester l'envoi d'emails :

1. Ouvrez le site (`index.html`)
2. Ajoutez un produit au panier
3. Cliquez sur le panier
4. Cliquez sur "Passer la commande"
5. Remplissez le formulaire
6. Cliquez sur "Confirmer la commande"
7. Vérifiez votre boîte mail `mohamedrhaouti@esac.ma`

## 📊 Format de l'email reçu

**Sujet:** `🛒 Nouvelle commande - [Prénom] [Nom] - [Total] DH`

**Contenu:**
- Header Nayma Home avec design
- Informations client complètes
- Tableau détaillé des produits
- Total en gros caractères
- Note "Paiement à la livraison"
- Date et heure de commande

## 🔄 Mise à jour future

Pour ajouter plus de fonctionnalités :
- Notification SMS via Brevo
- Email de confirmation au client
- Suivi de commande
- Historique des commandes

## ⚠️ Important

- L'API Key Brevo est encodée mais reste visible dans le code source
- Pour une sécurité maximale en production, utilisez un backend
- Les limites Brevo gratuites : 300 emails/jour
- Gardez votre API Key privée

## 📞 Support

En cas de problème :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les spams dans l'email
3. Vérifiez les quotas Brevo
4. Contactez le support Brevo si nécessaire

---

✨ **Le système est prêt à recevoir des commandes !** ✨
