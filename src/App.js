import { useState } from 'react';
import { FiSearch } from 'react-icons/fi'
import './styles.css'

import api from './services/api';


function App() {

  //15684307000126

  const[input, setInput] = useState('')
  
  async function handleSearch() {
    
    if(input === '') {
      alert("Campo vazio, digite algo para dar continuidade.")
      return;
    }

    try {
      const response = await api.get(`${input}`)
      console.log(response)

    } catch {
      alert("Erro ao buscar")
      setInput("")
    }

  }

  return (
    <div className="container">
      <h1 className='title'>Desafio Técnico</h1>

      <div className="containerInput">
        <input
        type="text"
        placeholder="Digite seu cep..."
        value={input}
        onChange={(evente) => setInput(evente.target.value) }
        />

        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#FFF"/>
        </button>
      </div>

      <main className="main">
        <h2>Cnpj: 32423423423</h2>
        <span>UF: DF</span>
        <span>Razão Sozial: Frango no Pote LTDA</span>
        <span>Nome Fantasia: Frango no Pote</span>
        <span>Data Inicio da Atividade: 2022/04/12</span>
        <span>Natureza Juridica: Sociedade Empresária Limitada</span>
        <span>Situação Cadastral: SUSPENSA</span>
        <span>Data Situação Cadastral: 2012/05/25</span>
        <span>Qualificação Do Reponsável: 49</span>
        <span>Capital Social: R$ 300.000.00</span>
        <span>Porte Da Empresa: MICRO EMPRESA</span>
        <span>Opção do Mei: false</span>
      </main>

    </div>
  );
}

export default App;
