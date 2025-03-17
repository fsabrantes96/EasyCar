Rotas - projetos EasyCar
----------------------------------------------

[X] Consultar se existe corrida pendente (hoje) para o usuario logado
    GET -> /rides
    Filtros: passenger_user_id, pickup_date, ride_id, driver_user_id, status

[X] - Cadastrar novas caronas 
    POST -> /rides

[X] - Cancelar um pedido de carona (excluir o pedido)
    DELETE -> /rides/123

[X] - Finalizar uma carona que foi concluída 
    PUT -> /rides/123/finish
    Body: passenger_user_id

[x] - Consultar as corridas para o motorista (corridas dele + corridas pendentes sem motorista)
    GET -> /rides/drivers/456

[X] - Consultar todos os dados de uma determinada corrida 
    GET -> /rides/123 

[X] - Motorista aceitar uma carona 
    PUT -> /rides/123/accept
    Body: driver_user_id

[X] - Motorista cancelar uma carona
    PUT -> /rides/123/cancel

Business Rules (Regras de Negocio)
----------------------------------------------

[X] o usuario só pode pedir uma carona por vez

[ ] o motorista só pode aceitar uma carona por vez