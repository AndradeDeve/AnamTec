import React from "react";
import { Form, Button, Row, Col } from 
"react-bootstrap";
import personIcon from '../../../assets/person-icon.png';
import searchIcon from '../../../assets/search-icon.png';
import './FilterAcess.css'
const AccessFilters = () => {
  return (
    <Form className="d-flex p-2  mb-2">
      <Row className="mb-2">
        <div className="d-flex">
        <Col md={2}><Form.Control className="InputSearch" type="text" placeholder="RM" /></Col>
        <Col classeName="InputSearch" md={3}><Form.Control type="text" placeholder="Nome" /></Col>
        <Col classeName="InputSearch" md={3}><Form.Control type="text" placeholder="Curso" /></Col>
       
        <Col md={2}>
          <Form.Select>
            <option>Aluno</option>
            <option>Professor</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select>
            <option>Ativo</option>
            <option>Inativo</option>
          </Form.Select>
        </Col>
        </div>
      </Row>
      <Button className="btnSearch">Pesquisar</Button>
    </Form>
  );
};

export default AccessFilters;
