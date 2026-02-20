// ARQUIVO: frontend/src/App.jsx
import { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaMapMarkerAlt, 
  FaRoad, 
  FaMap, 
  FaCity 
} from 'react-icons/fa';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    uf: ''
  });
  
  const [status, setStatus] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);

  // Atualiza os dados conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Consome a API do ViaCEP quando o usuário sai do campo de CEP
  const buscarCep = async (e) => {
    const cepLimpo = e.target.value.replace(/\D/g, '');
    
    // Só busca se o CEP tiver exatamente 8 números
    if (cepLimpo.length !== 8) return;

    setStatus({ tipo: '', texto: 'Buscando endereço...' });

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setStatus({ tipo: 'erro', texto: 'CEP não encontrado.' });
        setFormData(prev => ({ ...prev, rua: '', bairro: '', cidade: '', uf: '' }));
      } else {
        setStatus({ tipo: '', texto: '' });
        // Atualiza o estado com os dados que vieram da API
        setFormData(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        }));
      }
    } catch (error) {
      setStatus({ tipo: 'erro', texto: 'Erro ao buscar o CEP.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ tipo: '', texto: '' });

    try {
      const response = await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok || response.status === 202) {
        setStatus({ tipo: 'sucesso', texto: 'Sucesso! Seus dados foram recebidos.' });
        // Limpa o formulário todo após sucesso
        setFormData({ nome: '', email: '', cpf: '', cep: '', rua: '', bairro: '', cidade: '', uf: '' }); 
      } else {
        setStatus({ tipo: 'erro', texto: data.erro || 'Ocorreu um erro.' });
      }
    } catch (error) {
      setStatus({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo do Sistema" className="logo" onError={(e) => e.target.style.display = 'none'} />
      
      <h2>Cadastro VIP</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nome">Nome Completo</label>
          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input 
              type="text" id="nome" name="nome" required 
              placeholder="Seu nome" value={formData.nome} onChange={handleChange} 
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" id="email" name="email" required 
              placeholder="Seu melhor e-mail" value={formData.email} onChange={handleChange} 
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="cpf">CPF</label>
          <div className="input-wrapper">
            <FaIdCard className="input-icon" />
            <input 
              type="text" id="cpf" name="cpf" required 
              placeholder="000.000.000-00" maxLength="14" value={formData.cpf} onChange={handleChange} 
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="cep">CEP</label>
          <div className="input-wrapper">
            <FaMapMarkerAlt className="input-icon" />
            <input 
              type="text" id="cep" name="cep" required 
              placeholder="00000-000" maxLength="9" 
              value={formData.cep} 
              onChange={handleChange} 
              onBlur={buscarCep} /* Dispara a busca ao sair do campo */
            />
          </div>
        </div>

        {/* Campos de endereço preenchidos automaticamente */}
        {formData.rua && (
          <>
            <div className="input-group">
              <label>Rua</label>
              <div className="input-wrapper">
                <FaRoad className="input-icon" />
                <input type="text" value={formData.rua} readOnly style={{ opacity: 0.8 }} />
              </div>
            </div>

            <div className="input-group">
              <label>Bairro</label>
              <div className="input-wrapper">
                <FaMap className="input-icon" />
                <input type="text" value={formData.bairro} readOnly style={{ opacity: 0.8 }} />
              </div>
            </div>

            <div className="input-group">
              <label>Cidade / UF</label>
              <div className="input-wrapper">
                <FaCity className="input-icon" />
                <input type="text" value={`${formData.cidade} - ${formData.uf}`} readOnly style={{ opacity: 0.8 }} />
              </div>
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Processando...' : 'Garantir Vaga'}
        </button>
      </form>

      {status.texto && (
        <div className={`mensagem ${status.tipo}`}>
          {status.texto}
        </div>
      )}
    </div>
  );
}

export default App;