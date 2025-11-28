// 1. Definição do preço diário (pode vir de um input no futuro, mas mantemos fixo por agora)
const dailyPrice = 150.00; 

// 2. FUNÇÃO PRINCIPAL: Garante que o código só rode após o HTML estar pronto.
document.addEventListener('DOMContentLoaded', () => {

    // --- Buscando Elementos do DOM ---
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const totalNightsSpan = document.getElementById('total-nights');
    const totalPriceStrong = document.getElementById('total-price');

    // 💡 VERIFICAÇÃO CRÍTICA DE ID
    // Se algum destes elementos for null, o script para com um erro no console.
    if (!checkInInput || !checkOutInput || !totalNightsSpan || !totalPriceStrong) {
        console.error("ERRO CRÍTICO: Um ou mais IDs HTML estão incorretos ou faltando. Verifique se os IDs 'check-in', 'check-out', 'total-nights' e 'total-price' existem.");
        return; // Para o script se os IDs não forem encontrados.
    }

    // --- Função de Cálculo ---
    function calculatePrice() {
        const checkInValue = checkInInput.value;
        const checkOutValue = checkOutInput.value;

        // 1. Verificação de Preenchimento Básico
        if (!checkInValue || !checkOutValue) {
            totalNightsSpan.textContent = '0';
            totalPriceStrong.textContent = 'R$ 0.00';
            return;
        }
        
        // 2. Criação de Objetos Date no formato Universal (Forçando UTC para resolver problemas de soma/fuso horário)
        // Adicionamos 'T00:00:00Z' para garantir que a comparação seja feita à meia-noite UTC.
        const checkInDate = new Date(checkInValue + 'T00:00:00Z');
        const checkOutDate = new Date(checkOutValue + 'T00:00:00Z');
        
        // 3. Validação de Datas (Checa por NaN - Not a Number, indicando data inválida)
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            totalNightsSpan.textContent = '0';
            totalPriceStrong.textContent = 'R$ 0.00 (Formato Inválido)';
            return;
        }

        // 4. Validação de Ordem (Check-out deve ser APÓS Check-in)
        if (checkOutDate <= checkInDate) {
             totalNightsSpan.textContent = '0';
             totalPriceStrong.textContent = 'R$ 0.00 (Datas Inválidas)';
             return;
        }

        // 5. Cálculo de Dias (A diferença em milissegundos é convertida para dias)
        const oneDay = 1000 * 60 * 60 * 24; 
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        
        // Usa Math.round para obter o número exato de dias (noites)
        const diffDays = Math.round(diffTime / oneDay);

        // 6. Calcula e Formata o Preço
        const totalPrice = diffDays * dailyPrice;

        // 7. Atualiza o HTML
        totalNightsSpan.textContent = diffDays;
        totalPriceStrong.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    }

    // --- Escutadores de Eventos (Inicialização) ---
    // A função será chamada automaticamente quando o usuário mudar as datas.
    checkInInput.addEventListener('change', calculatePrice);
    checkOutInput.addEventListener('change', calculatePrice);

    // Chamada inicial (se houver datas pré-preenchidas)
    calculatePrice();
});