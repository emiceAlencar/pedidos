const realizarPedido = require("./pedido");

describe("realizarPedido", () => {
  let consultarEstoqueMock;
  let salvarPedidoMock;
  let enviarEmailMock;

  beforeEach(() => {
    consultarEstoqueMock = jest.fn();
    salvarPedidoMock = jest.fn();
    enviarEmailMock = jest.fn();
  });

  test("deve realizar um pedido válido", async () => {
    const produto = {
      id: 1,
      quantidade: 2,
    };

    consultarEstoqueMock.mockResolvedValue(10);
    salvarPedidoMock.mockResolvedValue(true);

    const resultado = await realizarPedido(
      produto,
      consultarEstoqueMock,
      salvarPedidoMock,
      enviarEmailMock
    );

    expect(resultado).toBe("Pedido realizado");
  });

  test("deve consultar o estoque usando o id do produto", async () => {
    const produto = {
      id: 1,
      quantidade: 2,
    };

    consultarEstoqueMock.mockResolvedValue(10);
    salvarPedidoMock.mockResolvedValue(true);

    await realizarPedido(
      produto,
      consultarEstoqueMock,
      salvarPedidoMock,
      enviarEmailMock
    );

    expect(consultarEstoqueMock).toHaveBeenCalled();
    expect(consultarEstoqueMock).toHaveBeenCalledWith(1);
  });

  test("deve salvar o pedido com o objeto produto", async () => {
    const produto = {
      id: 1,
      quantidade: 2,
    };

    consultarEstoqueMock.mockResolvedValue(10);
    salvarPedidoMock.mockResolvedValue(true);

    await realizarPedido(
      produto,
      consultarEstoqueMock,
      salvarPedidoMock,
      enviarEmailMock
    );

    expect(salvarPedidoMock).toHaveBeenCalledWith(produto);
  });

  test("deve enviar email de confirmação uma única vez", async () => {
    const produto = {
      id: 1,
      quantidade: 2,
    };

    consultarEstoqueMock.mockResolvedValue(10);
    salvarPedidoMock.mockResolvedValue(true);

    await realizarPedido(
      produto,
      consultarEstoqueMock,
      salvarPedidoMock,
      enviarEmailMock
    );

    expect(enviarEmailMock).toHaveBeenCalled();
    expect(enviarEmailMock).toHaveBeenCalledTimes(1);
    expect(enviarEmailMock).toHaveBeenCalledWith(
      "Pedido realizado com sucesso"
    );
  });

  test("deve lançar erro quando o estoque for insuficiente", async () => {
    const produto = {
      id: 1,
      quantidade: 10,
    };

    consultarEstoqueMock.mockResolvedValue(5);

    await expect(
      realizarPedido(
        produto,
        consultarEstoqueMock,
        salvarPedidoMock,
        enviarEmailMock
      )
    ).rejects.toThrow("Estoque insuficiente");
  });

  test("deve lançar erro quando a quantidade for inválida", async () => {
    const produto = {
      id: 1,
      quantidade: 0,
    };

    await expect(
      realizarPedido(
        produto,
        consultarEstoqueMock,
        salvarPedidoMock,
        enviarEmailMock
      )
    ).rejects.toThrow("Quantidade inválida");
  });

  test("nâo deve salvar nem enviar email quando o estoque for insuficiente", async () => {
    const produto = {
      id: 1,
      quantidade: 10,
    };

    consultarEstoqueMock.mockResolvedValue(5);

    await expect(
      realizarPedido(
        produto,
        consultarEstoqueMock,
        salvarPedidoMock,
        enviarEmailMock
      )
    ).rejects.toThrow("Estoque insuficiente");

    expect(salvarPedidoMock).not.toHaveBeenCalled();
    expect(enviarEmailMock).not.toHaveBeenCalled();
  });

  test("Nnão deve consultar o estoque quando a quantidade for inválida", async () => {
    const produto = {
      id: 1,
      quantidade: -1,
    };

    await expect(
      realizarPedido(
        produto,
        consultarEstoqueMock,
        salvarPedidoMock,
        enviarEmailMock
      )
    ).rejects.toThrow("Quantidade inválida");

    expect(consultarEstoqueMock).not.toHaveBeenCalled();
  });

  test("deve aceitar o pedido quando estoque e quantidade forem iguais", async () => {
    const produto = {
      id: 1,
      quantidade: 10,
    };

    consultarEstoqueMock.mockResolvedValue(10);
    salvarPedidoMock.mockResolvedValue(true);

    const resultado = await realizarPedido(
      produto,
      consultarEstoqueMock,
      salvarPedidoMock,
      enviarEmailMock
    );

    expect(resultado).toBe("Pedido realizado");
    expect(salvarPedidoMock).toHaveBeenCalledWith(produto);
    expect(enviarEmailMock).toHaveBeenCalledTimes(1);
  });
});