async function realizarPedido(
  produto,
  consultarEstoque,
  salvarPedido,
  enviarEmail
) {
  if (produto.quantidade <= 0) {
    throw new Error("Quantidade inválida");
  }

  const estoque = await consultarEstoque(produto.id);

  if (estoque < produto.quantidade) {
    throw new Error("Estoque insuficiente");
  }

  await salvarPedido(produto);

  enviarEmail("Pedido realizado com sucesso");

  return "Pedido realizado";
}

module.exports = realizarPedido;