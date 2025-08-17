import React from "react";
import { Table } from "react-bootstrap";
import AccessRow from "../AcessRow/AcessRow";

const AccessTable = () => {
  // Simulação de dados (futuramente vem da API)
  const dados = [
    { rm: "1001", nome: "João Silva", entidade: "Aluno", disciplina: "-", curso: "Desenvolvimento de Sistemas", coordenador: "Marcos Costa", status: "Inativo" },
    { rm: "2002", nome: "Aline Francisca", entidade: "Professor", disciplina: "P.O.O Python", curso: "Desenvolvimento de Sistemas", coordenador: "Marcos Costa", status: "Ativo" }
    
  ];

  return (
    <div className="table-responsive p-3 bg-white border rounded shadow-sm">
      <Table striped bordered hover>
        <thead className="table-primary">
          <tr>
            <th>RM</th>
            <th>Nome</th>
            <th>Entidade</th>
            <th>Disciplina</th>
            <th>Curso</th>
            <th>Coordenador</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <AccessRow key={index} data={item} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccessTable;
