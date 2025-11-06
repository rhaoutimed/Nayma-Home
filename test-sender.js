// Test pour vérifier les expéditeurs autorisés sur Brevo

const API_KEY = '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';

async function getSenders() {
    console.log('🔍 Récupération des expéditeurs autorisés sur Brevo...\n');
    
    try {
        const response = await fetch('https://api.brevo.com/v3/senders', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Expéditeurs autorisés trouvés:\n');
            
            if (data.senders && data.senders.length > 0) {
                data.senders.forEach((sender, index) => {
                    console.log(`${index + 1}. Email: ${sender.email}`);
                    console.log(`   Nom: ${sender.name}`);
                    console.log(`   Actif: ${sender.active ? '✅' : '❌'}`);
                    console.log('');
                });
                
                console.log('='.repeat(60));
                console.log('✅ Utilisez un de ces emails comme expéditeur dans script.js');
                console.log('='.repeat(60));
            } else {
                console.log('❌ Aucun expéditeur vérifié trouvé !');
                console.log('\n⚠️  Action requise:');
                console.log('1. Allez sur https://app.brevo.com/senders');
                console.log('2. Ajoutez et vérifiez un email expéditeur');
                console.log('3. Utilisez cet email vérifié dans le code\n');
            }
        } else {
            const error = await response.json();
            console.error('❌ Erreur:', error);
        }
    } catch (error) {
        console.error('❌ Erreur réseau:', error.message);
    }
}

// Test avec un expéditeur générique Brevo
async function testWithDefaultSender() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 Test avec expéditeur par défaut Brevo...\n');
    
    const testEmailData = {
        sender: {
            name: "Nayma Home",
            email: "noreply@brevo.com"  // Email par défaut Brevo
        },
        to: [
            {
                email: "mohamedrhaouti@esac.ma",
                name: "Destinataire Test"
            }
        ],
        subject: "🧪 Test Nayma Home - Vérification expéditeur",
        htmlContent: `
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Test d'envoi depuis Brevo</h2>
                    <p>Si vous recevez cet email, la configuration fonctionne !</p>
                    <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
                </body>
            </html>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(testEmailData)
        });

        console.log('Statut:', response.status, response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('\n✅ Email envoyé avec succès !');
            console.log('📨 Message ID:', result.messageId);
            console.log('📧 Vérifiez: mohamedrhaouti@esac.ma\n');
        } else {
            const error = await response.json();
            console.error('\n❌ Erreur:', error.message);
            if (error.message.includes('sender')) {
                console.log('\n⚠️  L\'email expéditeur doit être vérifié sur Brevo');
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

// Exécuter les tests
(async () => {
    await getSenders();
    await testWithDefaultSender();
})();
