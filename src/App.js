import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Button from '@material-ui/core/Button';
import { BiTrash, BiUserPlus } from "react-icons/bi";

import './styles.css';

import api from './services/api';

function App() {

  /*
  15.684.3070001-26
  24410913000144
  00.280.2730002-18
  */

  const [inputSalvar, setInputSalvar] = useState('');
  const [inputBuscar, setInputBuscar] = useState('');
  const [empresa, setEmpresa] = useState({});
  const [showInputSalvar, setShowInputSalvar] = useState(false);
  const [showInputBuscar, setShowInputBuscar] = useState(false);
  const [showMain, setShowMain] = useState(false);

  function validarCampoPesquisa(campo) {
    var regex = /^[0-9.\/-]+$/; // Expressão regular para verificar se contém apenas números, pontos, barras e traços
  
    // Remove os caracteres '.', '-', e '/' do campo de pesquisa
    var numerosCampo = campo.replace(/[^\d.\/-]/g, '');
  
    if (numerosCampo !== campo) {
      throw new Error("O campo de pesquisa contém letras ou caracteres inválidos!");
    }

    if (numerosCampo.length === 0) {
      throw new Error("O campo de pesquisa está vazio!");
    }
  
  }

  function validarCNPJ(cnpj) {
    // Remove todos os caracteres não numéricos do CNPJ
    var numerosCNPJ = cnpj.replace(/[^\d]/g, '');

    // Verifica se o CNPJ possui 14 dígitos
    if (numerosCNPJ.length !== 14) {
      throw new Error("Formato inserido invalido. formato aceitavel (XX.XXX.XXX/XXXX-XX)");
    }
  }

  async function handleSearch() {
    try {
      validarCampoPesquisa(inputBuscar);
      validarCNPJ(inputBuscar)

      var numerosCNPJ = inputBuscar.replace(/[^\d]/g, '');

      const response = await api.get(`${numerosCNPJ}`);
      setEmpresa(response.data);

      if(response.data.statusCodeValue == 404) {
        throw new Error(response.data.body);   
      } else {
        setShowMain(true);
        setInputBuscar('');
      }

    } catch (error){
      alert(error.message);
      setInputBuscar('');
      return;
    } 
  }

  async function handleSalvar() {
    try {
      validarCampoPesquisa(inputSalvar);
      validarCNPJ(inputSalvar)

      var numerosCNPJ = inputSalvar.replace(/[^\d]/g, '');

      const response = await api.post(`${numerosCNPJ}`); // Substitua 'sua-rota' pela rota correta da sua API
      console.log(response.data);

      if(response.data.statusCodeValue == 409) {
        throw new Error(response.data.body);
      } 

      if(response.data.statusCodeValue == 404) {
        throw new Error(response.data.body);   
      } else {
        alert(`Empresa Salva Com Sucesso! - Basta consulta-la com ${inputSalvar}`)
        setInputSalvar('');
        setShowMain(false);
        setShowInputSalvar(false);
      }

    } catch (error) {
      alert(error.message);
      setInputSalvar('');
    }
  }

  function handleShowInputSalvar() {
    setShowInputSalvar(true);
    setShowInputBuscar(false)
    setShowMain(false);
  }

  function handleShowInputBuscar() {
    setShowInputBuscar(true);
    setShowInputSalvar(false);
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

  return (
    <div className="container">
      <h1 className="title">Cadastro De Empresas</h1>

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
            placeholder="Digite o CNPJ.."
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
            placeholder="Busca por CNPJ ou Nome..."
            value={inputBuscar}
            onChange={(event) => setInputBuscar(event.target.value)}
          />

          <button className="buttonSearch" onClick={handleSearch}>
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
