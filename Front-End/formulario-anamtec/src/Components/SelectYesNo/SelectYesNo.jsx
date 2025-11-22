import React from "react";
import { Form } from "react-bootstrap";

function SelectYesNo ({ label, value, onChange, controlId, error }) {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value} onChange={onChange} isInvalid={!!error}>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
            </Form.Select>

            {error && (
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
}

export default SelectYesNo;