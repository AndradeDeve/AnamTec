// src/controller/formularioAnamneseController.js

import express from "express";

const router = express.Router();

// ✅ POST /formularioAnamnese
router.post("/", async (req, res) => {
  try {
    // console.log("📩 Dados recebidos do formulário:", req.body);

    // Aqui você pode salvar no banco se quiser
    // await repository.save(req.body);

    return res.status(201).json({
      message: "Formulário de anamnese recebido com sucesso!",
      dados: req.body,
    });
  } catch (error) {
    console.error("❌ Erro ao processar formulário:", error);
    return res.status(500).json({ message: "Erro interno ao processar o formulário." });
  }
});

export default router;
