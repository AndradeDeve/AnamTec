function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for número

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false; // Elimina CPFs com todos os dígitos iguais
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }

  let digito1 = 11 - (soma % 11);
  if (digito1 > 9) digito1 = 0;

  if (parseInt(cpf[9]) !== digito1) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }

  let digito2 = 11 - (soma % 11);
  if (digito2 > 9) digito2 = 0;

  return parseInt(cpf[10]) === digito2;
}

export  {validarCPF};