
$(document).ready(function() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    $(".add-carrinho").click(function() {
        let produto = {
            id: $(this).data("id"),
            nome: $(this).data("nome"),
            preco: parseFloat($(this).data("preco"))
        };
        carrinho.push(produto);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        alert("Produto adicionado ao carrinho!");
    });
    
    function atualizarCarrinho() {
        let lista = "";
        let total = 0;
        carrinho.forEach((produto, index) => {
            lista += `<tr>
                        <td>${produto.nome}</td>
                        <td>R$ ${produto.preco.toFixed(2)}</td>
                        <td><button class="remover-item" data-index="${index}">Remover</button></td>
                      </tr>`;
            total += produto.preco;
        });
        $("#carrinho-itens").html(lista);
        $("#total-preco").text(`R$ ${total.toFixed(2)}`);
    }
    atualizarCarrinho();
    
    $(document).on("click", ".remover-item", function() {
        let index = $(this).data("index");
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarCarrinho();
    });
    
    $("#pagar").click(function() {
        $.ajax({
            url: "https://api.mercadopago.com/checkout/preferences?access_token=TEST-4091194903714957",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                items: carrinho.map(produto => ({
                    title: produto.nome,
                    unit_price: produto.preco,
                    quantity: 1,
                    currency_id: "BRL"
                })),
                payer: { email: "comprador@example.com" },
                auto_return: "approved"
            }),
            success: function(response) {
                window.location.href = response.init_point;
            },
            error: function(error) {
                console.error("Erro ao processar pagamento", error);
            }
        });
    });
});
