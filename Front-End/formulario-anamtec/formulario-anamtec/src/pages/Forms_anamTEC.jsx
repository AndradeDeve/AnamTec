import React from 'react';

const AnamneseForm = () => {
  return (
    <div className="container mt-9">
      <h2 className="text-center mb-4">Formulário de Anamnese</h2>
      <form className="card p-4 shadow-sm">
        <div className="row mb-1">
          <div className="col-md-6">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" placeholder="Digite o nome" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Curso</label>
            <input type="text" className="form-control" placeholder="Digite o curso" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Data de Nascimento</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Turno</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Semestre</label>
            <input type="text" className="form-control" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-1">
            <label className="form-label">Idade</label>
            <input type="number" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Gênero</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Reside com</label>
            <input type="text" className="form-control" />
          </div>
        </div>

        <div className="mb-1">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>

        <div className="row mb-3">
          <div className="col-md-2">
            <label className="form-label">CEP</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Número</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-1">
            <label className="form-label">UF</label>
            <input type="text" className="form-control" />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Logradouro</label>
          <input type="text" className="form-control" />
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <label className="form-label">Bairro</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Cidade</label>
            <input type="text" className="form-control" />
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary">Próximo</button>
        </div>
      </form>
    </div>
  );
};

export default AnamneseForm;
