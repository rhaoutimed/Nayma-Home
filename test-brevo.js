// Test de la configuration Brevo SMTP
// Credentials fournis par l'utilisateur

const SMTP_USERNAME = '97239e001@smtp-brevo.com';
const SMTP_PASSWORD = 'YD4v8A2BMyQLbI3k';
const API_KEY = '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';

async function testBrevoAPI() {
    console.log('🔍 Test de la configuration Brevo...\n');
    console.log('📧 SMTP Username:', SMTP_USERNAME);
    console.log('🔑 SMTP Password:', SMTP_PASSWORD);
    console.log('🔐 API Key:', API_KEY);
    console.log('\n' + '='.repeat(60) + '\n');

    // Test de l'API Brevo
    const testEmailData = {
        sender: {
            name: "Test Nayma Home",
            email: "mohamedrhaouti@esac.ma"
        },
        to: [
            {
                email: "mohamedrhaouti@esac.ma",
                name: "Test Destinataire"
            }
        ],
        subject: "🧪 Test de configuration Brevo - Nayma Home",
        htmlContent: `
            <html>
                <head></head>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #8B7355;">✅ Test réussi !</h1>
                    <p>Votre configuration Brevo fonctionne correctement.</p>
                    <hr>
                    <p><strong>SMTP Username:</strong> ${SMTP_USERNAME}</p>
                    <p><strong>Date du test:</strong> ${new Date().toLocaleString('fr-FR')}</p>
                    <hr>
                    <p>Votre site Nayma Home est prêt à envoyer des emails ! 🎉</p>
                </body>
            </html>
        `,
        textContent: `Test de configuration Brevo\n\nVotre configuration fonctionne correctement.\nSMTP Username: ${SMTP_USERNAME}\nDate: ${new Date().toLocaleString('fr-FR')}`
    };

    try {
        console.log('📤 Envoi de l\'email de test...\n');
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(testEmailData)
        });

        console.log('📊 Statut de la réponse:', response.status, response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('\n✅ SUCCÈS ! Email envoyé avec succès !\n');
            console.log('📨 Message ID:', result.messageId);
            console.log('\n' + '='.repeat(60));
            console.log('✅ Configuration Brevo validée !');
            console.log('📧 Vérifiez votre boîte email: mohamedrhaouti@esac.ma');
            console.log('='.repeat(60) + '\n');
            return true;
        } else {
            const errorData = await response.json();
            console.error('\n❌ ERREUR lors de l\'envoi !\n');
            console.error('Code d\'erreur:', errorData.code);
            console.error('Message:', errorData.message);
            
            if (errorData.message && errorData.message.includes('api-key')) {
                console.error('\n⚠️  L\'API Key semble invalide ou non activée.');
                console.error('👉 Vérifiez que votre clé API est bien activée sur Brevo.');
            }
            
            if (errorData.message && errorData.message.includes('sender')) {
                console.error('\n⚠️  L\'email expéditeur n\'est pas vérifié.');
                console.error('👉 Vérifiez l\'email mohamedrhaouti@esac.ma sur Brevo.');
            }
            
            console.error('\n' + '='.repeat(60) + '\n');
            return false;
        }
    } catch (error) {
        console.error('\n❌ ERREUR RÉSEAU !\n');
        console.error('Type d\'erreur:', error.name);
        console.error('Message:', error.message);
        console.error('\n⚠️  Vérifiez votre connexion internet.\n');
        console.error('='.repeat(60) + '\n');
        return false;
    }
}

// Exécuter le test
testBrevoAPI();
