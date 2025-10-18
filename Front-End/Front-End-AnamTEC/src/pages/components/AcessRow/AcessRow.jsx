import React from "react";
const AccessRow = ({ data }) => {
  return (
    <tr>
      <td>{data.rm}</td>
      <td>{data.nome}</td>
      <td>{data.entidade}</td>
      <td>{data.disciplina}</td>
      <td>{data.curso}</td>
      <td>{data.coordenador}</td>
      <td>
        <span className={`badge ${data.asttus === "Ativo" ? "bg-success" : "bg-danger"}`}>
          {data.status}
        </span>
      </td>
      <td>
        <button className="btn btn-sm btn-outline-secondary">
          {data.status === "Ativo" ? "Inativar" : "Ativar"}
        </button>
      </td>
    </tr>
  );
};

export default AccessRow;
