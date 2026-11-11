import type { Metadata } from 'next';

import {
  LegalCallout,
  LegalContact,
  LegalSection,
  LegalTable,
} from '@/components/legal/legal-blocks';
import { LegalDocumentShell } from '@/components/legal/legal-document-shell';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description:
    'Como o Queimando Panela coleta, usa, protege, mantém e exclui seus dados. Bases legais, cookies, compartilhamento e direitos pela LGPD.',
  alternates: {
    canonical: '/privacidade',
  },
  openGraph: {
    title: 'Política de privacidade — Queimando Panela',
    description:
      'O que guardamos, por quê, por quanto tempo e como você mantém o controle dos seus dados.',
    type: 'article',
  },
};

const toc = [
  { id: 'controlador', label: 'Controlador e compromisso' },
  { id: 'dados', label: 'Quais dados a gente trata' },
  { id: 'cookies', label: 'Cookies e tecnologias' },
  { id: 'bases-legais', label: 'Por que tratamos' },
  { id: 'compartilhamento', label: 'Com quem compartilhamos' },
  { id: 'seguranca', label: 'Como protegemos' },
  { id: 'retencao', label: 'Retenção e exclusão' },
  { id: 'direitos', label: 'Seus direitos pela LGPD' },
  { id: 'criancas', label: 'Crianças e adolescentes' },
  { id: 'mudancas', label: 'Mudanças nesta política' },
  { id: 'contato', label: 'Contato, ANPD e segurança' },
];

export default function PrivacidadePage() {
  return (
    <LegalDocumentShell
      documentLabel="Política de privacidade"
      title="Política de privacidade"
      dek="O que a gente guarda, por quê, por quanto tempo e como você mantém o controle. Sem letras miúdas escondidas atrás da panela."
      version="1.0"
      updatedAt="11 de novembro de 2026"
      readingTime="8 minutos"
      summary={[
        {
          label: 'Só o necessário',
          text: 'Nome, e-mail, receitas e o mínimo para manter sua conta segura e funcionando.',
        },
        {
          label: 'Nada de venda',
          text: 'Não vendemos dados, não usamos publicidade comportamental e não temos rastreadores de terceiros.',
        },
        {
          label: 'Você no controle',
          text: 'Acesso, correção e exclusão pelo e-mail de contato, com resposta em até 15 dias.',
        },
      ]}
      toc={toc}
      otherDocument={{
        href: '/termos',
        label: 'Termos de uso',
        description:
          'As regras de conta, publicação, direitos autorais, uso da IA e responsabilidades.',
      }}
    >
      <LegalSection
        id="controlador"
        index="01"
        title="Controlador e compromisso"
      >
        <p>
          O controlador dos seus dados é <strong>Douglas Maciel</strong>, à
          frente do <strong>Queimando Panela</strong>. O canal oficial para
          assuntos de privacidade — incluindo o papel de encarregado — é{' '}
          <a href="mailto:contato@queimandopanela.com.br">
            contato@queimandopanela.com.br
          </a>
          .
        </p>
        <p>
          Esta política explica como tratamos dados pessoais no site, na conta,
          na publicação de receitas, nos recursos de inteligência artificial e
          nos e-mails transacionais, em conformidade com a{' '}
          <strong>LGPD (Lei nº 13.709/2018)</strong>.
        </p>
        <p>O compromisso é curto e vale para todo o site:</p>
        <ul>
          <li>
            Coletar <strong>só o necessário</strong> para a finalidade
            informada, com transparência e prazo definido.
          </li>
          <li>
            <strong>Não vender, alugar ou trocar</strong> seus dados, nem
            usá-los para publicidade comportamental.
          </li>
          <li>
            <strong>Não usar suas receitas para treinar modelos de IA</strong> e
            não tomar decisões automatizadas que afetem seus direitos.
          </li>
          <li>
            Manter <strong>segurança proporcional ao risco</strong> e responder
            aos seus pedidos dentro dos prazos legais.
          </li>
        </ul>
        <p>
          O site é destinado a maiores de 18 anos. Se você tem menos, não crie
          conta; veja a seção sobre crianças e adolescentes.
        </p>
      </LegalSection>

      <LegalSection id="dados" index="02" title="Quais dados a gente trata">
        <p>
          A tabela abaixo mostra o que é tratado, para quê, com qual base legal
          e por quanto tempo. O conteúdo de uma receita publicada é público; os
          demais dados seguem os usos e prazos descritos.
        </p>

        <LegalTable
          caption="Dados pessoais tratados pelo Queimando Panela, finalidade, base legal e prazo de retenção"
          columns={['O que', 'Para quê', 'Base legal', 'Por quanto tempo']}
          rows={[
            {
              key: 'cadastro',
              cells: [
                'Cadastro e conta',
                'Nome, e-mail, senha em hash, imagem de perfil e status de verificação. Com login Google, também identificadores e tokens do provedor.',
                'Criar, autenticar, proteger e recuperar a conta; exibir autoria.',
                'Execução de contrato (art. 7º, V) e legítimo interesse na segurança (art. 7º, IX).',
                'Até a exclusão da conta.',
              ],
            },
            {
              key: 'receitas',
              cells: [
                'Receitas e imagens',
                'Título, resumo, história, ingredientes, preparo, tempos, porções, utensílios, classificação, nutrição, fotos e metadados.',
                'Publicar, exibir, buscar e compartilhar receitas; manter a autoria.',
                'Execução de contrato e consentimento manifestado ao publicar.',
                'Enquanto publicadas. Você pode editar ou excluir.',
              ],
            },
            {
              key: 'geladeira',
              cells: [
                'Uso do "O que tem?"',
                'ID da conta, IP e data/hora de cada geração. Os ingredientes digitados não são armazenados.',
                'Aplicar o limite de 3 criações por 24 horas e coibir abuso.',
                'Legítimo interesse (art. 7º, IX) e execução de contrato.',
                'Enquanto necessário à segurança. Exclusão sob solicitação em até 30 dias.',
              ],
            },
            {
              key: 'sessoes',
              cells: [
                'Sessões e segurança',
                'Token de sessão, IP, navegador, dispositivo e datas de acesso.',
                'Manter o login e prevenir fraude, sequestro de sessão e abuso.',
                'Execução de contrato e legítimo interesse.',
                'Sessão expira após 7 dias de inatividade e é renovada no máximo a cada 24 horas.',
              ],
            },
            {
              key: 'comentarios',
              cells: [
                'Comentários e avaliações',
                'Conta, texto, nota e data, quando a funcionalidade estiver disponível.',
                'Permitir interação e moderar a comunidade.',
                'Execução de contrato.',
                'Até a exclusão ou remoção do conteúdo.',
              ],
            },
            {
              key: 'emails',
              cells: [
                'E-mails transacionais',
                'Endereço de e-mail, tokens de redefinição de senha e status de envio.',
                'Recuperar senha e enviar avisos necessários sobre a conta.',
                'Execução de contrato e cumprimento de obrigação legal.',
                'Token expira após o uso ou o prazo de validade; registros pelo tempo necessário.',
              ],
            },
            {
              key: 'atendimento',
              cells: [
                'Atendimento',
                'E-mail, conteúdo da mensagem e anexos que você enviar.',
                'Responder, registrar e acompanhar solicitações.',
                'Legítimo interesse e consentimento.',
                'Enquanto necessário ao atendimento e a prazos legais.',
              ],
            },
            {
              key: 'logs',
              cells: [
                'Logs técnicos',
                'IP, data/hora, navegador, páginas acessadas e erros, conforme o provedor de hospedagem.',
                'Segurança, disponibilidade, diagnóstico e prevenção a abuso.',
                'Legítimo interesse e obrigação legal.',
                'Prazo curto, conforme a configuração dos provedores.',
              ],
            },
          ]}
        />

        <h3>O que a gente não pede</h3>
        <p>
          Não coletamos CPF, endereço residencial, telefone, dados de pagamento,
          localização precisa, contatos do celular ou identificadores de
          publicidade. O site não tem cadastro de cartão porque o uso é
          gratuito.
        </p>

        <h3>Dados sensíveis e conteúdo público</h3>
        <p>
          Não pedimos dados sensíveis (como informações de saúde, religião,
          biometria ou orientação sexual). Evite publicá-los em receitas,
          histórias, comentários ou fotos. Quando você publica uma receita, o
          conteúdo fica visível para qualquer pessoa — não inclua dados seus ou
          de terceiros que não deveriam ser públicos.
        </p>

        <LegalCallout
          title="Receita publicada é receita pública"
          tone="warning"
        >
          <p>
            Se a receita tem uma história pessoal, uma foto da sua cozinha ou o
            nome de alguém, tudo isso pode ser visto e compartilhado. Revise
            antes de publicar e remova o que não quiser expor.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection id="cookies" index="03" title="Cookies e tecnologias">
        <p>
          Usamos apenas <strong>cookies essenciais</strong>, necessários para
          manter você autenticado e proteger a sessão. Não usamos cookies de
          publicidade, pixels de redes sociais, ferramentas de analytics ou
          rastreamento entre sites.
        </p>

        <LegalTable
          caption="Cookies essenciais utilizados pelo site"
          columns={['Cookie', 'Para que serve', 'Duração']}
          rows={[
            {
              key: 'sessao',
              cells: [
                'Sessão',
                'Mantém você autenticado entre páginas e protege o acesso à conta.',
                'Até 7 dias de inatividade.',
              ],
            },
            {
              key: 'cache-sessao',
              cells: [
                'Cache de sessão',
                'Evita consultas repetidas ao banco a cada navegação, mantendo o site rápido.',
                'Curta, renovada junto da sessão.',
              ],
            },
          ]}
        />

        <p>
          Também não usamos <code>localStorage</code> ou{' '}
          <code>sessionStorage</code> para rastrear comportamento. Se algum dia
          houver cookie não essencial, ele só será ativado depois do seu
          consentimento, com opção clara de recusa.
        </p>
        <p>
          Você pode bloquear ou apagar cookies nas configurações do navegador.
          Só lembre que, sem os cookies essenciais, o login e a publicação de
          receitas deixam de funcionar.
        </p>
      </LegalSection>

      <LegalSection id="bases-legais" index="04" title="Por que tratamos">
        <p>
          Cada tratamento tem uma finalidade e uma base legal. Não usamos uma
          base genérica para tudo:
        </p>
        <ul>
          <li>
            <strong>Execução de contrato</strong> — criar e manter sua conta,
            publicar receitas, autenticar sessões, processar a análise de IA e
            enviar e-mails necessários.
          </li>
          <li>
            <strong>Legítimo interesse</strong> — segurança, prevenção a fraude
            e abuso, estabilidade do serviço, atendimento e exercício regular de
            direitos, sempre com o mínimo de dados necessário.
          </li>
          <li>
            <strong>Consentimento</strong> — quando você escolhe publicar um
            conteúdo e em comunicações opcionais. Você pode revogar o
            consentimento a qualquer momento, sem afetar o que já foi feito.
          </li>
          <li>
            <strong>Obrigação legal ou regulatória</strong> — quando precisamos
            guardar registros para cumprir a lei, ordens judiciais ou
            regulatórias.
          </li>
          <li>
            <strong>Exercício regular de direitos</strong> — conservar registros
            mínimos para defesa em processos administrativos ou judiciais.
          </li>
        </ul>
        <p>
          A análise de IA é apoio, não decisão automatizada com efeito jurídico.
          A publicação e a revisão final são atos humanos. Não criamos perfis
          comportamentais para publicidade.
        </p>
      </LegalSection>

      <LegalSection
        id="compartilhamento"
        index="05"
        title="Com quem compartilhamos"
      >
        <p>
          Não vendemos, alugamos ou trocamos seus dados. Compartilhamos apenas
          com operadores que tornam o site possível, sob contrato e acesso
          restrito, ou quando a lei exigir.
        </p>

        <LegalTable
          caption="Operadores que podem tratar dados em nome do Queimando Panela"
          columns={['Operador', 'O que faz', 'Onde', 'Salvaguarda']}
          rows={[
            {
              key: 'vercel',
              cells: [
                'Vercel',
                'Hospedagem e execução do site.',
                'Estados Unidos',
                'Contrato de tratamento e cláusulas de proteção de dados.',
              ],
            },
            {
              key: 'cloudflare',
              cells: [
                'Cloudflare R2',
                'Armazenamento das imagens de receitas.',
                'Rede global',
                'Contrato de tratamento, acesso restrito e HTTPS.',
              ],
            },
            {
              key: 'postgres',
              cells: [
                'Provedor PostgreSQL',
                'Banco de dados da aplicação.',
                'Infraestrutura contratada',
                'Contrato de tratamento, acesso restrito e conexão criptografada.',
              ],
            },
            {
              key: 'groq',
              cells: [
                'Groq',
                'Processamento de IA para análise e sugestão de receitas.',
                'Estados Unidos',
                'Contrato de API; conteúdo não é usado para treinar modelos.',
              ],
            },
            {
              key: 'resend',
              cells: [
                'Resend',
                'Envio de e-mails transacionais, como redefinição de senha.',
                'Estados Unidos',
                'Contrato de tratamento e acesso restrito.',
              ],
            },
            {
              key: 'google',
              cells: [
                'Google',
                'Login opcional via OAuth, quando você escolhe essa opção.',
                'Estados Unidos',
                'Sujeito às políticas do Google e ao seu consentimento.',
              ],
            },
          ]}
        />

        <p>
          Também podemos compartilhar dados para cumprir ordem judicial,
          requisição de autoridade competente ou obrigação legal, ou para
          exercer direitos em processo. Quando permitido, avisamos você.
        </p>
        <p>
          Em caso de reorganização, incorporação ou transferência do projeto, os
          dados podem ser transferidos ao sucessor, que fica obrigado a manter
          esta política e os mesmos níveis de proteção. Você será informado e
          poderá exercer seus direitos.
        </p>
        <p>
          <strong>Transferência internacional:</strong> alguns operadores estão
          fora do Brasil, principalmente nos Estados Unidos. A transferência
          segue o art. 33 da LGPD e é protegida por cláusulas contratuais,
          avaliações de segurança e limitação ao mínimo necessário.
        </p>
        <p>
          Suas receitas publicadas são visíveis publicamente e podem ser
          acessadas por qualquer pessoa, inclusive fora do Brasil. Isso faz
          parte da natureza de um blog.
        </p>
      </LegalSection>

      <LegalSection id="seguranca" index="06" title="Como protegemos">
        <p>A segurança é tratada em camadas, do navegador ao banco de dados:</p>
        <ul>
          <li>
            <strong>Tráfego criptografado</strong> — o site usa HTTPS/TLS entre
            seu navegador e nossos servidores.
          </li>
          <li>
            <strong>Senhas protegidas</strong> — a senha é armazenada como hash
            criptográfico (scrypt), nunca em texto puro. Nem nós conseguimos
            visualizá-la.
          </li>
          <li>
            <strong>Sessões seguras</strong> — cookies de sessão com HttpOnly,
            Secure em produção e SameSite, com expiração e renovação limitadas.
          </li>
          <li>
            <strong>Controle de acesso</strong> — cada pessoa só edita as
            próprias receitas; o servidor valida sessão e autoria em cada
            operação.
          </li>
          <li>
            <strong>Segredos fora do código</strong> — chaves de API, banco e
            armazenamento ficam em variáveis de ambiente restritas, não no
            repositório.
          </li>
          <li>
            <strong>Limites de uso</strong> — autenticação, análise de IA e
            geração de receitas têm limites e proteções contra abuso.
          </li>
          <li>
            <strong>Imagens tratadas</strong> — fotos passam por processamento e
            são armazenadas em serviço de objetos. Imagens publicadas ficam com
            URL pública.
          </li>
          <li>
            <strong>Resposta a incidentes</strong> — investigamos falhas,
            contemos o problema e, quando houver risco relevante, comunicamos os
            titulares e a ANPD conforme a LGPD.
          </li>
        </ul>

        <LegalCallout title="Nenhum sistema é 100% seguro" tone="safe">
          <p>
            Fazemos o possível para proteger seus dados, mas nenhum serviço está
            livre de falhas. Se suspeitar de acesso indevido, troque a senha e
            escreva para a gente imediatamente.
          </p>
        </LegalCallout>

        <h3>Encontrou uma vulnerabilidade?</h3>
        <p>
          Agradecemos se você avisar em vez de explorar. Envie os detalhes para
          o e-mail de contato, sem acessar dados de outras pessoas, sem
          interromper o serviço e sem divulgar o problema publicamente antes da
          correção. Vamos confirmar o recebimento e trabalhar na correção.
        </p>

        <LegalCallout title="Não envie dados sensíveis" tone="warning">
          <p>
            Não mande senhas, documentos, exames ou dados de terceiros por
            e-mail nem os coloque nas fotos da receita. O canal de atendimento
            não é cofre e as imagens publicadas são públicas.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection id="retencao" index="07" title="Retenção e exclusão">
        <p>
          Guardamos cada dado apenas pelo tempo necessário à finalidade ou ao
          prazo legal. O resumo é este:
        </p>
        <ul>
          <li>
            <strong>Conta e receitas:</strong> até você pedir a exclusão. Você
            pode editar ou remover receitas antes disso.
          </li>
          <li>
            <strong>Sessões:</strong> expiram após 7 dias de inatividade e são
            renovadas no máximo a cada 24 horas.
          </li>
          <li>
            <strong>Geladeira:</strong> conta, IP e data/hora ficam enquanto
            forem necessários ao controle de abuso. A exclusão sob solicitação é
            feita em até 30 dias.
          </li>
          <li>
            <strong>Atendimento e e-mails:</strong> ficam pelo tempo necessário
            para responder, registrar e cumprir prazos legais.
          </li>
          <li>
            <strong>Logs técnicos:</strong> permanecem por prazo curto conforme
            o provedor de hospedagem e as necessidades de segurança.
          </li>
        </ul>

        <h3>Como pedir a exclusão</h3>
        <p>
          Envie um e-mail para{' '}
          <a href="mailto:contato@queimandopanela.com.br">
            contato@queimandopanela.com.br
          </a>{' '}
          com o assunto <strong>&quot;Exclusão de dados&quot;</strong>, usando o
          endereço cadastrado. Podemos confirmar sua identidade antes de apagar
          qualquer coisa, para evitar que alguém exclua a conta de outra pessoa.
        </p>
        <p>
          A exclusão é gratuita e concluída em até <strong>30 dias</strong>. Ao
          apagar a conta, removemos perfil, receitas, imagens, sessões e
          registros de uso da geladeira. Comentários, quando existirem, podem
          ser removidos ou anonimizados. Buscadores e serviços de cache podem
          levar mais tempo para atualizar; solicitamos a remoção quando
          possível.
        </p>
        <p>
          Alguns registros podem ser mantidos se houver obrigação legal,
          necessidade de defesa em processo ou prevenção a fraude. Nesses casos,
          o acesso é restrito e o dado deixa de ser usado para outras
          finalidades. Estatísticas agregadas e sem identificação podem
          permanecer.
        </p>

        <LegalCallout title="A exclusão é definitiva" tone="warning">
          <p>
            Antes de pedir, exporte ou guarde uma cópia das receitas que quiser
            manter. Depois da exclusão, não conseguimos recuperar o conteúdo
            apagado.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection id="direitos" index="08" title="Seus direitos pela LGPD">
        <p>
          A LGPD garante a você, a qualquer momento e sem custo, os seguintes
          direitos:
        </p>
        <ul>
          <li>
            <strong>Confirmação e acesso</strong> — saber se tratamos seus dados
            e receber uma cópia dos que estiverem sob nossa responsabilidade.
          </li>
          <li>
            <strong>Correção</strong> — atualizar dados incompletos, inexatos ou
            desatualizados.
          </li>
          <li>
            <strong>Anonimização, bloqueio ou eliminação</strong> — de dados
            desnecessários, excessivos ou tratados em desconformidade com a lei.
          </li>
          <li>
            <strong>Portabilidade</strong> — receber seus dados em formato
            estruturado, quando aplicável e viável tecnicamente.
          </li>
          <li>
            <strong>Eliminação</strong> — apagar dados tratados com base no
            consentimento, ressalvadas obrigações legais.
          </li>
          <li>
            <strong>Informação sobre compartilhamento</strong> — saber com quais
            entidades públicos ou privados compartilhamos dados.
          </li>
          <li>
            <strong>Informação sobre consentimento</strong> — entender as
            consequências de não consentir e como revogar.
          </li>
          <li>
            <strong>Revogação do consentimento</strong> — retirar o
            consentimento a qualquer momento, sem prejudicar usos anteriores.
          </li>
          <li>
            <strong>Oposição</strong> — contestar tratamento feito sem o seu
            consentimento, quando houver descumprimento da LGPD.
          </li>
          <li>
            <strong>Revisão de decisões automatizadas</strong> — pedir revisão
            humana de decisões tomadas apenas por máquina. Hoje não tomamos
            decisões com efeito jurídico sobre você, mas o direito permanece.
          </li>
          <li>
            <strong>Petição à ANPD</strong> — reclamar à Autoridade Nacional de
            Proteção de Dados, sem prejuízo de falar antes com a gente.
          </li>
        </ul>

        <h3>Como exercer</h3>
        <p>
          Escreva para o e-mail de contato com o assunto{' '}
          <strong>&quot;Direitos LGPD&quot;</strong>, descrevendo o pedido e o
          endereço cadastrado. Podemos pedir uma confirmação de identidade para
          proteger seus dados. A resposta é gratuita e ocorre em até{' '}
          <strong>15 dias</strong>, prorrogáveis com justificativa.
        </p>
        <p>
          Se o pedido envolver dados de terceiros, obrigação legal ou prevenção
          a fraude, podemos explicar o motivo da limitação. Você também pode
          reclamar diretamente à ANPD.
        </p>

        <LegalCallout title="Você não precisa justificar" tone="safe">
          <p>
            Pedir acesso, correção ou exclusão é um direito. Não é preciso
            explicar por que você quer seus dados. Basta dizer o que precisa.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection id="criancas" index="09" title="Crianças e adolescentes">
        <p>
          O Queimando Panela é destinado a maiores de 18 anos e não é planejado
          para crianças ou adolescentes. Não coletamos intencionalmente dados de
          menores de 18 anos.
        </p>
        <p>
          Se identificarmos uma conta de menor, ela poderá ser encerrada e os
          dados eliminados. O responsável legal pode solicitar informações,
          correção ou exclusão pelo e-mail de contato.
        </p>
        <p>
          Fotos de crianças só podem ser publicadas pelo responsável legal, com
          cuidado com exposição e dados sensíveis. Na dúvida, não publique.
        </p>
      </LegalSection>

      <LegalSection id="mudancas" index="10" title="Mudanças nesta política">
        <p>
          Esta política pode mudar com o tempo, por exemplo quando um recurso
          novo passar a tratar dados diferentes. A versão vigente, com data e
          número, fica sempre nesta página.
        </p>
        <p>
          Mudanças materiais serão comunicadas no site ou por e-mail com
          antecedência razoável, quando possível. Se a mudança exigir novo
          consentimento, ele será pedido de forma clara antes de qualquer uso.
        </p>
        <p>Versões anteriores podem ser solicitadas pelo e-mail de contato.</p>
      </LegalSection>

      <LegalSection id="contato" index="11" title="Contato, ANPD e segurança">
        <p>
          Para qualquer assunto de privacidade — acesso, correção, exclusão,
          portabilidade, dúvida ou reclamação — use o canal abaixo. O prazo de
          resposta é de até 15 dias. Para segurança, o mesmo endereço serve.
        </p>
        <p>
          Se você não ficar satisfeito com a resposta, pode procurar a{' '}
          <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> pelo
          site{' '}
          <a
            href="https://www.gov.br/anpd/pt-br"
            target="_blank"
            rel="noopener noreferrer"
          >
            gov.br/anpd
          </a>
          .
        </p>

        <LegalContact
          title="Falar sobre privacidade"
          note="Para agilizar, informe o e-mail cadastrado e o tipo de pedido. Nunca envie sua senha ou documentos pessoais por e-mail."
        >
          <p>
            Use o assunto <strong>&quot;Privacidade&quot;</strong> ou{' '}
            <strong>&quot;Direitos LGPD&quot;</strong>. Se for sobre uma receita
            específica, inclua o link.
          </p>
        </LegalContact>

        <p>
          <strong>Versão 1.0</strong> — publicada em 11 de novembro de 2026.
          Substitui versões anteriores, se houver.
        </p>
      </LegalSection>
    </LegalDocumentShell>
  );
}
