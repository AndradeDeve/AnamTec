import React from "react";
import { Form } from "react-bootstrap";

function SelectYesNo ({ label, value, onChange, controlId }) {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange}>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
            </Form.Select>
        </Form.Group>
    );
}

export default SelectYesNo;