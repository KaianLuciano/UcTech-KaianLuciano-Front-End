import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Button from '@material-ui/core/Button';
import { BiTrash, BiUserPlus } from "react-icons/bi";
import Table from 'react-bootstrap/Table';

import './styles.css';

import api from './services/api';

function App() {

  /*
  24410913000144 = NU
  15.375.357/0001-21 = Coco Bambu
  11.405.679/0001-15 = Potiguar Caldos
  */

  const [inputSalvar, setInputSalvar] = useState('');
  const [inputBuscar, setInputBuscar] = useState('');
  const [empresa, setEmpresa] = useState({});
  const [showInputSalvar, setShowInputSalvar] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showInputBuscar, setShowInputBuscar] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [listaEmpresas, setListaEmpresas] = useState([]);

  function validarCampoPesquisa(campo) {
    if (campo.length === 0) {
      throw new Error("O campo de pesquisa está vazio!");
    }
  
  }

  function formatarCNPJ(cnpj) {
    if (cnpj && cnpj.length === 14) {
      return cnpj.substring(0, 2) + '.' +
             cnpj.substring(2, 5) + '.' +
             cnpj.substring(5, 8) + '/' +
             cnpj.substring(8, 12) + '-' +
             cnpj.substring(12);
    }
    return cnpj;
  }
  
  async function handleListarEmpresas() {
    try {
      handleShowTable()
      const response = await api.get();
      console.log(response)
      setListaEmpresas(response.data.body);
    } catch (error) {
      alert('Erro ao obter a lista de empresas');
      console.log(error);
    }
  }

  function validarCNPJ(cnpj) {

    var regexLetras = /[a-zA-Z]/;

    if (regexLetras.test(cnpj)) {
      return; // Retorna do método se houver letras no CNPJ
    }

    var numerosCNPJ;
    if (typeof cnpj === 'string') {
      numerosCNPJ = cnpj.replace(/[^\d]/g, '');
    } 

    var numerosCNPJ = cnpj.replace(/[^\d]/g, '');
    console.log("teste")

    // Verifica se o CNPJ possui 14 dígitos
    if (numerosCNPJ.length !== 14) {
      throw new Error("Formato inserido invalido. formato aceitavel (XX.XXX.XXX/XXXX-XX)");
    }
  }

  async function handleSearch() {
    try {
      validarCampoPesquisa(inputBuscar);
      validarCNPJ(inputBuscar)

      if (typeof inputBuscar === 'string') {
        var numerosCNPJ = inputBuscar.replace(/[^\d]/g, '');
      } 

      let response;

      if (/^\d{14}$/.test(numerosCNPJ)) {
        console.log(inputBuscar)
        response = await api.get(`${numerosCNPJ}`);
      } else {
        response = await api.get(`/nome/${inputBuscar}`);
      }

      if(response.data.statusCodeValue == 404) {
        handleCancel();
        console.log(response)
        throw new Error(response.data.body);   
      } else {
        response.data.body.cnpj = formatarCNPJ(response.data.body.cnpj)
        console.log(response.data.body.cnpj)
        setEmpresa(response.data);
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
    setShowTable(false)
  }

  function handleShowInputBuscar() {
    setShowInputBuscar(true);
    setShowInputSalvar(false);
    setShowMain(false);
    setShowTable(false)
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
    setShowTable(false)
  }

  function handleShowTable() {
    setShowTable(true);
    setShowInputBuscar(false)
    setShowInputSalvar(false)
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
          style={{ marginRight: '10px' }}
          onClick={handleShowInputBuscar}
        >
          Buscar Empresa
        </Button>
        <Button
          variant="contained"
          onClick={handleListarEmpresas}
        >
          Listar Empresas Cadastradas
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

      {showTable && Object.keys(listaEmpresas).length > 0 && (
      <div className="table">
        <h2>Lista de Empresas Cadastradas</h2>
        
          <ul>
            {listaEmpresas.map((empresa) => (
              <li key={empresa.id}>{empresa.razaoSocial}</li>
            ))}
          </ul>
        
      </div>
      )}

      

    </div>
  );
}

export default App;
