// ARQUIVO: backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const processLeadInBackground = async (leadId, email) => {
    console.log(`[Worker] Iniciando processamento do lead ${leadId}...`);
    db.run(`INSERT INTO event_logs (lead_id, status, detalhes) VALUES (?, 'Processando', 'Iniciando validação e envio de email')`, [leadId]);

    setTimeout(() => {
        console.log(`[Worker] E-mail enviado para ${email}!`);
        db.run(`INSERT INTO event_logs (lead_id, status, detalhes) VALUES (?, 'Notificado', 'E-mail de boas-vindas enviado')`, [leadId]);
    }, 3000);
};

app.post('/api/leads', (req, res) => {
    // Agora recebemos os dados de endereço do frontend
    const { nome, email, cpf, cep, rua, bairro, cidade, uf } = req.body;
    
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const cpfLimpo = cpf.replace(/\D/g, ''); 
    const cepLimpo = cep.replace(/\D/g, ''); 

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Query atualizada com os novos campos
        const insertLead = `INSERT INTO leads (nome, email, cpf, cep, rua, bairro, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.run(insertLead, [nomeLimpo, emailLimpo, cpfLimpo, cepLimpo, rua, bairro, cidade, uf], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(400).json({ erro: 'E-mail ou CPF já cadastrado, ou erro no banco.' });
            }

            const leadId = this.lastID;
            const insertLog = `INSERT INTO event_logs (lead_id, status, detalhes) VALUES (?, 'Recebido', 'Lead inserido no banco')`;

            db.run(insertLog, [leadId], (errLog) => {
                if (errLog) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ erro: 'Erro ao registrar log.' });
                }

                db.run('COMMIT');
                processLeadInBackground(leadId, emailLimpo);

                res.status(202).json({ 
                    mensagem: 'Sucesso! Processamento iniciado.',
                    leadId: leadId
                });
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});