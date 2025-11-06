// Configuration Email - EmailJS
// Ce fichier contient la configuration encodée pour l'envoi d'emails

const EMAIL_CONFIG = {
    // Configuration EmailJS - Service gratuit et sécurisé
    serviceId: 'service_nayma', // Sera configuré après création du compte EmailJS
    templateId: 'template_nayma',
    publicKey: 'YOUR_PUBLIC_KEY', // Sera généré par EmailJS
    
    // Email de destination (encodé en base64 pour plus de sécurité)
    toEmail: atob('bW9oYW1lZHJoYW91dGlAZXNhYy5tYQ=='), // mohamedrhaouti@esac.ma
    fromName: 'Nayma Home - Nouvelle Commande'
};

// Alternative: Utilisation de Brevo API directement
const BREVO_CONFIG = {
    apiKey: 'xkeysib-' + atob('OTcyMzllMDAxQHNtdHAtYnJldm8uY29t'), // API Key encodée
    endpoint: 'https://api.brevo.com/v3/smtp/email',
    sender: {
        email: 'mohamedrhaouti@esac.ma',
        name: 'Commande a traiter'
    },
    recipient: {
        email: 'mohamedrhaouti@esac.ma',
        name: 'Nayma Home'
    }
};
