document.addEventListener('DOMContentLoaded', () => {
    // 1. Referências aos Elementos
    const cardSection = document.querySelector('.card-section');
    const contactSection = document.querySelector('.contact-section');
    const emailBtn = document.getElementById('email-btn');
    const backBtn = document.getElementById('back-btn');
    const contactButtons = document.querySelectorAll('.contact-btn');
    const form = document.getElementById('meuFormulario');
    const submitBtn = document.getElementById('submit-btn');

    // Função auxiliar para rastrear eventos no GA4
    const trackGAEvent = (eventName, params) => {
        // Verifica se a função gtag está disponível (se o GA carregou)
        if (typeof gtag === 'function') {
            gtag('event', eventName, {
                'event_category': 'Cartao_Digital',
                ...params
            });
        }
    };

    // --- 2. Lógica de Transição de Tela e Rastreamento ---

    // Ação de Abrir o Formulário (clique no E-MAIL)
    const showEmailForm = (event) => {
        event.preventDefault(); // Impede o link de navegar
        
        if (cardSection && contactSection) {
            // Esconde o Cartão
            cardSection.classList.remove('visible');
            cardSection.classList.add('hidden');
            
            // Mostra o Formulário
            contactSection.classList.remove('hidden');
            contactSection.classList.add('visible');

            // RASTREIO GA4: Abertura do Formulário (Visualização)
            trackGAEvent('visualizacao_form', {
                'event_label': 'Formulario_Contato',
                'tipo_interacao': 'Transicao_Tela'
            });
        }
    };

    // Ação de Fechar o Formulário (Botão Voltar)
    const showCard = (event) => {
        event.preventDefault(); // Impede o link de navegar
        
        if (cardSection && contactSection) {
            // Esconde o Formulário
            contactSection.classList.remove('visible');
            contactSection.classList.add('hidden');
            
            // Mostra o Cartão
            cardSection.classList.remove('hidden');
            cardSection.classList.add('visible');

            // RASTREIO GA4: Clique no Voltar
            trackGAEvent('clique_voltar', {
                'event_label': 'Voltar_para_Card',
                'tipo_interacao': 'Transicao_Tela'
            });
        }
    };

    // --- 3. Event Listeners para Todos os Botões ---

    // Rastreia cliques nos botões de contato (TELEFONE, WHATSAPP, LOCALIZAÇÃO)
    contactButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            
            // O botão E-MAIL será tratado abaixo
            if (button.id === 'email-btn') {
                return; 
            }
            
            // RASTREIO GA4: Clique no Botão de Contato
            trackGAEvent('clique_contato', {
                'event_label': button.getAttribute('data-type'), // TELEFONE, WHATSAPP, etc.
                'tipo_interacao': 'Link_Externo'
            });
        });
    });

    // Event Listener E-MAIL (combina clique + transição + rastreamento)
    if (emailBtn) {
        emailBtn.addEventListener('click', (event) => {
            // Rastreia o clique no botão E-MAIL antes da transição
            trackGAEvent('clique_contato', {
                'event_label': 'EMAIL_FORM',
                'tipo_interacao': 'Transicao_Tela'
            });
            showEmailForm(event);
        });
    }

    // Event Listener BOTÃO VOLTAR
    if (backBtn) {
        backBtn.addEventListener('click', showCard);
    }
    
    // Rastreamento do clique no botão de Envio
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
             // RASTREIO GA4: Tentativa de Envio
            trackGAEvent('tentativa_envio_form', {
                'event_label': 'Formulario_Contato_SM',
                'tipo_interacao': 'Submit_Button'
            });
        });
        
        // **IMPORTANTE:** O rastreamento de "Sucesso de Envio" (Conversão) 
        // deve ser feito APÓS o Formspree confirmar que o e-mail foi enviado.
        // Se o Formspree te redirecionar para uma página de "Obrigado", você deve 
        // rastrear essa página no GA4. Se não, você precisaria de um código AJAX 
        // para o formulário, que é mais complexo. Por enquanto, a "Tentativa" é um bom indicador.
    }
});