import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Button from '@material-ui/core/Button';
import { BiTrash, BiUserPlus } from "react-icons/bi";

import './styles.css';

import api from './services/api';

function App() {
  const [inputSalvar, setInputSalvar] = useState('');
  const [inputBuscar, setInputBuscar] = useState('');
  const [empresa, setEmpresa] = useState({});
  const [showInputSalvar, setShowInputSalvar] = useState(false);
  const [showInputBuscar, setShowInputBuscar] = useState(false);
  const [showMain, setShowMain] = useState(false);

  async function handleSearch() {
    if (inputBuscar === '') {
      alert('Campo de busca vazio, digite algo para continuar.');
      return;
    }

    try {
      const response = await api.get(`${inputBuscar}`);
      setEmpresa(response.data);
      console.log(response.data);
      setShowMain(true);
      setInputBuscar('');
    } catch {
      alert('Erro ao buscar empresa');
      setInputBuscar('');
    }
  }

  async function handleSalvar() {
    if (inputSalvar === '') {
      alert('Campo de CNPJ vazio, digite algo para continuar.');
      return;
    }

    try {
      const response = await api.post(`${inputSalvar}`); // Substitua 'sua-rota' pela rota correta da sua API
      console.log(response.data);
      setInputSalvar('');
      setShowMain(false);
      setShowInputSalvar(false);
    } catch {
      alert('Erro ao salvar empresa');
      setInputSalvar('');
    }
  }

  function handleShowInputSalvar() {
    setShowInputSalvar(true);
    setShowMain(false);
  }

  function handleHideInputSalvar() {
    setShowInputSalvar(false);
    setShowMain(false);
  }

  function handleShowInputBuscar() {
    setShowInputBuscar(true);
    setShowMain(false);
  }

  function handleHideInputBuscar() {
    setShowInputBuscar(false);
    setShowMain(false);
  }

  function handleShowMain() {
    setShowMain(true);
    setShowInputSalvar(false);
    setShowInputBuscar(true);
  }

  function handleCancel() {
    setShowInputSalvar(false);
    setShowInputBuscar(false);
    setShowMain(false);
  }

  function handleSearchAndShowMain() {
    handleSearch();
    handleShowMain();
  }

  function handleSalvarEmpresa() {
    // Lógica para salvar a empresa
    setInputSalvar('');
    setShowInputSalvar(false);
    setShowMain(false);
  }

  return (
    <div className="container">
      <h1 className="title">Desafio Técnico</h1>

      <div className="button-group">
        <Button
          variant="contained"
          style={{ marginRight: '10px' }}
          onClick={handleShowInputSalvar}
        >
          Salvar Empresa
        </Button>
        <Button
          variant="contained"
          onClick={handleShowInputBuscar}
        >
          Buscar Empresa
        </Button>
      </div>

      {showInputSalvar && (
        <div className="containerInput">
          <input
            type="text"
            placeholder="Digite o CNPJ da empresa para salvar..."
            value={inputSalvar}
            onChange={(event) => setInputSalvar(event.target.value)}
          />

          <button className="buttonSearch" onClick={handleSalvar}>
            <BiUserPlus size={25} color="#FFF"/>
          </button>
          <button className="buttonSearch" onClick={handleCancel}>
            <BiTrash size={25} color='#FFF'/>
          </button>
        </div>
      )}

      {showInputBuscar && (
        <div className="containerInput">
          <input
            type="text"
            placeholder="Digite o CNPJ da empresa para buscar..."
            value={inputBuscar}
            onChange={(event) => setInputBuscar(event.target.value)}
          />

          <button className="buttonSearch" onClick={handleSearchAndShowMain}>
            <FiSearch size={25} color="#FFF" />
          </button>
          <button className="buttonSearch" onClick={handleCancel}>
            <BiTrash size={25} color='#FFF'/>
          </button>
        </div>
      )}

      {showMain && Object.keys(empresa).length > 0 && (
        <main className="main">
          <h2>Empresa</h2>
          <span>Cnpj: {empresa.body.cnpj}</span>
          <span>UF: {empresa.body.uf}</span>
          <span>Razão Social: {empresa.body.razaoSocial}</span>
          <span>Nome Fantasia: {empresa.body.nomeFantasia}</span>
          <span>Data Inicio da Atividade: {empresa.body.dataInicioAtividade} </span>
          <span>Natureza Juridica: {empresa.body.naturezaJuridica}</span>
          <span>Situação Cadastral: {empresa.body.situacaoCadastral}</span>
          <span>Data Situação Cadastral: {empresa.body.dataSituacaoCadastral}</span>
          <span>Qualificação Do Reponsável: {empresa.body.qualificacaoDoResponsavel}</span>
          <span>Capital Social: {empresa.body.capitalSocial}</span>
          <span>Porte Da Empresa: {empresa.body.porteDaEmpresa}</span>
          <span>Opção do Mei: {empresa.body.opcaoMei}</span>
        </main>
      )}
    </div>
  );
}

export default App;
