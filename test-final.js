// Test final avec le bon expéditeur

const API_KEY = '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';

async function testFinalEmail() {
    console.log('🧪 Test d\'envoi final vers mohamedrhaouti@esac.ma\n');
    console.log('📧 Expéditeur: myjobid77@gmail.com (vérifié)');
    console.log('📧 Destinataire: mohamedrhaouti@esac.ma\n');
    console.log('='.repeat(60) + '\n');
    
    const testEmailData = {
        sender: {
            name: "Nayma Home - Nouvelle Commande",
            email: "myjobid77@gmail.com"
        },
        to: [
            {
                email: "mohamedrhaouti@esac.ma",
                name: "Nayma Home Admin"
            }
        ],
        subject: "🛒 TEST - Nouvelle commande Nayma Home",
        htmlContent: `
            <html>
                <body style="font-family: Arial, sans-serif; padding: 30px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #8B7355; border-bottom: 3px solid #D4A574; padding-bottom: 15px;">
                            🛒 Nouvelle Commande - Nayma Home
                        </h1>
                        
                        <h2 style="color: #333; margin-top: 30px;">Informations Client</h2>
                        <p><strong>Nom:</strong> Test Utilisateur</p>
                        <p><strong>Téléphone:</strong> 0612345678</p>
                        <p><strong>Email:</strong> test@example.com</p>
                        <p><strong>Ville:</strong> Casablanca</p>
                        <p><strong>Adresse:</strong> 123 Rue Test</p>
                        
                        <h2 style="color: #333; margin-top: 30px;">Produits commandés</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead>
                                <tr style="background-color: #8B7355; color: white;">
                                    <th style="padding: 12px; text-align: left;">Produit</th>
                                    <th style="padding: 12px; text-align: center;">Qté</th>
                                    <th style="padding: 12px; text-align: right;">Prix</th>
                                    <th style="padding: 12px; text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td style="padding: 15px;">Diffuseur d'Huiles Essentielles</td>
                                    <td style="padding: 15px; text-align: center;">2</td>
                                    <td style="padding: 15px; text-align: right;">199 DH</td>
                                    <td style="padding: 15px; text-align: right; font-weight: bold;">398 DH</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div style="margin-top: 30px; padding: 20px; background-color: #9DB4A8; border-radius: 8px; text-align: center;">
                            <h2 style="color: white; margin: 0;">Total: 398 DH</h2>
                            <p style="color: white; margin: 10px 0 0 0;">Paiement à la livraison</p>
                        </div>
                        
                        <p style="margin-top: 30px; color: #666; font-size: 14px; text-align: center;">
                            Date de commande: ${new Date().toLocaleString('fr-FR')}
                        </p>
                    </div>
                </body>
            </html>
        `,
        textContent: `
NOUVELLE COMMANDE - NAYMA HOME

Client: Test Utilisateur
Téléphone: 0612345678
Email: test@example.com
Ville: Casablanca
Adresse: 123 Rue Test

PRODUITS:
- Diffuseur d'Huiles Essentielles x2 = 398 DH

TOTAL: 398 DH
Paiement: À la livraison

Date: ${new Date().toLocaleString('fr-FR')}
        `
    };

    try {
        console.log('📤 Envoi en cours...\n');
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(testEmailData)
        });

        console.log('📊 Statut:', response.status, response.statusText, '\n');
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ ✅ ✅ EMAIL ENVOYÉ AVEC SUCCÈS ! ✅ ✅ ✅\n');
            console.log('📨 Message ID:', result.messageId);
            console.log('\n' + '='.repeat(60));
            console.log('📧 VÉRIFIEZ MAINTENANT VOTRE EMAIL:');
            console.log('   mohamedrhaouti@esac.ma');
            console.log('='.repeat(60));
            console.log('\n✉️  Sujet: "🛒 TEST - Nouvelle commande Nayma Home"');
            console.log('📥 Vérifiez aussi les SPAMS si vous ne le voyez pas\n');
        } else {
            const error = await response.json();
            console.error('❌ Erreur:', error);
        }
    } catch (error) {
        console.error('❌ Erreur réseau:', error.message);
    }
}

testFinalEmail();
